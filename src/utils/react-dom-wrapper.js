// Wrapper for react-dom that patches findDOMNode
// This is used as an alias in vite.config.js

// Import the actual react-dom
import * as ReactDOM from 'react-dom';

// Create findDOMNode polyfill
const findDOMNodePolyfill = function(node) {
  if (node == null) {
    return null;
  }
  
  if (node.nodeType === 1 || node.nodeType === 3) {
    return node;
  }
  
  if (typeof node === 'object' && 'current' in node) {
    return node.current;
  }
  
  if (node && typeof node === 'object') {
    const internalInstance = 
      node._reactInternalInstance || 
      node._reactInternalFiber || 
      node.__reactInternalInstance ||
      node.__reactFiber$ ||
      node._reactInternals;
      
    if (internalInstance) {
      let fiber = internalInstance;
      let depth = 0;
      const maxDepth = 50;
      
      while (fiber && depth < maxDepth) {
        if (fiber.stateNode) {
          const stateNode = fiber.stateNode;
          if (stateNode.nodeType === 1 || stateNode.nodeType === 3) {
            return stateNode;
          }
        }
        fiber = fiber.return || fiber.returnFiber;
        depth++;
      }
    }
  }
  
  return null;
};

// Patch ReactDOM
ReactDOM.findDOMNode = findDOMNodePolyfill;
if (ReactDOM.default) {
  ReactDOM.default.findDOMNode = findDOMNodePolyfill;
}

// Re-export everything from react-dom
export * from 'react-dom';
export { default } from 'react-dom';

