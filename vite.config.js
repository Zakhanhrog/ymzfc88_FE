import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Vite plugin to patch react-quill's findDOMNode usage
const patchReactQuill = () => {
  return {
    name: 'patch-react-quill',
    enforce: 'pre',
    transform(code, id) {
      // Only transform react-quill files
      if (id.includes('node_modules/react-quill') && id.endsWith('.js')) {
        // Replace findDOMNode calls with polyfill
        if (code.includes('findDOMNode')) {
          // Add polyfill at the top
          const polyfill = `
// Polyfill for findDOMNode (React 19 compatibility)
const findDOMNodePolyfill = function(node) {
  if (node == null) return null;
  if (node.nodeType === 1 || node.nodeType === 3) return node;
  if (typeof node === 'object' && 'current' in node) return node.current;
  if (node && typeof node === 'object') {
    const internalInstance = node._reactInternalInstance || node._reactInternalFiber || node.__reactInternalInstance || node.__reactFiber$ || node._reactInternals;
    if (internalInstance) {
      let fiber = internalInstance;
      let depth = 0;
      while (fiber && depth < 50) {
        if (fiber.stateNode && (fiber.stateNode.nodeType === 1 || fiber.stateNode.nodeType === 3)) {
          return fiber.stateNode;
        }
        fiber = fiber.return || fiber.returnFiber;
        depth++;
      }
    }
  }
  return null;
};
`;
          
          // Replace react_dom_1.default.findDOMNode with polyfill
          code = code.replace(/react_dom_1\.default\.findDOMNode/g, 'findDOMNodePolyfill');
          code = code.replace(/react_dom_1\["default"\]\.findDOMNode/g, 'findDOMNodePolyfill');
          code = code.replace(/react_dom_1\.findDOMNode/g, 'findDOMNodePolyfill');
          
          // Add polyfill at the beginning
          return polyfill + '\n' + code;
        }
      }
      return null;
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    patchReactQuill(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
