import React, { useRef, useMemo, Suspense, lazy, useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import promotionService from '../../services/promotionService';
import { API_BASE_URL } from '../../utils/constants';
import 'react-quill/dist/quill.snow.css';

// Lazy load ReactQuill to avoid React 19 compatibility issues
const ReactQuill = lazy(() => import('react-quill'));

const RichTextEditor = ({ value, onChange, placeholder = 'Nhập nội dung...' }) => {
  const quillRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState('');

  // Convert relative URL thành full URL để hiển thị trong editor
  const convertToDisplayHtml = (html) => {
    if (!html) return '';
    // Nếu đã có http thì giữ nguyên, nếu là relative URL thì convert
    return html.replace(
      /src="(\/uploads\/[^"]+)"/g,
      `src="${API_BASE_URL}$1"`
    );
  };

  // Convert full URL thành relative URL để lưu vào database
  const convertToSaveHtml = (html) => {
    if (!html) return '';
    // Thay thế full URL bằng relative URL
    return html.replace(
      new RegExp(API_BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      ''
    );
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Khi value thay đổi từ bên ngoài, convert để hiển thị
  useEffect(() => {
    if (isMounted && value !== undefined) {
      const displayHtml = convertToDisplayHtml(value);
      setDisplayValue(displayHtml);
      // Cập nhật quill editor nếu đã mount
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        if (quill && quill.root.innerHTML !== displayHtml) {
          quill.root.innerHTML = displayHtml;
        }
      }
    }
  }, [value, isMounted]);

  // Wrapper để đảm bảo HTML luôn dùng relative URL khi lưu (tiết kiệm ký tự)
  const handleChange = (html) => {
    // Convert full URL thành relative URL trước khi lưu
    const optimizedHtml = convertToSaveHtml(html);
    setDisplayValue(html); // Giữ full URL để hiển thị
    
    if (onChange) {
      onChange(optimizedHtml);
    }
  };

  // Custom image handler
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        message.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        message.error('Vui lòng chọn file ảnh');
        return;
      }

      try {
        message.loading({ content: 'Đang upload ảnh...', key: 'upload-image', duration: 0 });
        
        let imageUrl = await promotionService.uploadPromotionImage(file);
        
        // Lưu relative URL vào database để tiết kiệm ký tự
        // Backend trả về relative URL (ví dụ: /uploads/promotions/abc123.jpg)
        // Chỉ dài ~30-40 ký tự thay vì ~60-70 ký tự nếu dùng full URL
        
        // Get quill instance
        const quill = quillRef.current?.getEditor();
        if (!quill) return;
        
        // Get current selection
        const range = quill.getSelection(true);
        if (!range) {
          range = { index: quill.getLength(), length: 0 };
        }
        
        // Convert relative URL to full URL chỉ để hiển thị trong editor
        // Nhưng khi lưu vào HTML, sẽ dùng relative URL để tiết kiệm ký tự
        let displayUrl = imageUrl;
        if (imageUrl && !imageUrl.startsWith('http')) {
          if (imageUrl.startsWith('/')) {
            displayUrl = `${API_BASE_URL}${imageUrl}`;
          } else {
            displayUrl = `${API_BASE_URL}/${imageUrl}`;
          }
        }
        
        // Insert image với full URL để hiển thị trong editor
        quill.insertEmbed(range.index, 'image', displayUrl);
        
        // Move cursor after image
        quill.setSelection(range.index + 1);
        
        // Lấy HTML và thay thế full URL bằng relative URL trước khi lưu
        // Điều này giúp tiết kiệm ~30-40 ký tự mỗi ảnh
        setTimeout(() => {
          const html = quill.root.innerHTML;
          // Thay thế tất cả full URL bằng relative URL trong HTML
          const updatedHtml = html.replace(
            new RegExp(API_BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            ''
          );
          if (updatedHtml !== html) {
            // Cập nhật HTML với relative URL
            quill.root.innerHTML = updatedHtml;
            // Trigger onChange với HTML đã được tối ưu
            if (onChange) {
              onChange(updatedHtml);
            }
          } else {
            // Nếu không có thay đổi, vẫn trigger onChange
            if (onChange) {
              onChange(html);
            }
          }
        }, 50);
        
        message.success({ content: 'Upload ảnh thành công!', key: 'upload-image' });
      } catch (error) {
        console.error('Error uploading image:', error);
        message.error({ 
          content: 'Upload ảnh thất bại: ' + (error.response?.data?.message || error.message), 
          key: 'upload-image' 
        });
      }
    };
  };

  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  // Quill formats
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'script',
    'color',
    'background',
    'align',
    'link',
    'image',
    'video',
  ];

  if (!isMounted) {
    return (
      <div className="rich-text-editor-wrapper">
        <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d9d9d9', borderRadius: '6px' }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="rich-text-editor-wrapper">
      <Suspense
        fallback={
          <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d9d9d9', borderRadius: '6px' }}>
            <Spin size="large" />
          </div>
        }
      >
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={displayValue || convertToDisplayHtml(value || '')}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{
            backgroundColor: '#fff',
          }}
        />
      </Suspense>
    </div>
  );
};

export default RichTextEditor;

