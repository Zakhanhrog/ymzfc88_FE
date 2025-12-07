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

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        
        // Convert relative URL to full URL if needed
        if (imageUrl && !imageUrl.startsWith('http')) {
          if (imageUrl.startsWith('/')) {
            imageUrl = `${API_BASE_URL}${imageUrl}`;
          } else {
            imageUrl = `${API_BASE_URL}/${imageUrl}`;
          }
        }
        
        // Get quill instance
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        // Get current selection
        const range = quill.getSelection(true);
        if (!range) {
          range = { index: quill.getLength(), length: 0 };
        }
        
        // Insert image at cursor position
        quill.insertEmbed(range.index, 'image', imageUrl);
        
        // Move cursor after image
        quill.setSelection(range.index + 1);
        
        // Trigger onChange to update form value
        if (onChange) {
          onChange(quill.root.innerHTML);
        }
        
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
          value={value || ''}
          onChange={onChange}
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

