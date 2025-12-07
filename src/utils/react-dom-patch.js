// Patch react-dom globally for React 19 compatibility with react-quill
// This file must be imported FIRST before any other imports

import * as ReactDOM from 'react-dom';

// Create findDOMNode polyfill
const findDOMNodePolyfill = function(node) {
  if (node == null) {
    return null;
  }
  
  // If it's already a DOM node, return it
  if (node.nodeType === 1 || node.nodeType === 3) {
    return node;
  }
  
  // If it's a ref object, return the current value
  if (typeof node === 'object' && 'current' in node) {
    return node.current;
  }
  
  // For React components, try to find the DOM node
  if (node && typeof node === 'object') {
    // Try different React internal property names
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
if (!ReactDOM.findDOMNode) {
  ReactDOM.findDOMNode = findDOMNodePolyfill;
}

// Also patch on the default export if it exists
if (ReactDOM.default && !ReactDOM.default.findDOMNode) {
  ReactDOM.default.findDOMNode = findDOMNodePolyfill;
}

// Patch on window object for global access (in case react-quill accesses it differently)
if (typeof window !== 'undefined') {
  window.__REACT_DOM_FIND_DOM_NODE__ = findDOMNodePolyfill;
}

export default ReactDOM;
