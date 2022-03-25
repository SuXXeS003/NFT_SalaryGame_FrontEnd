import { useState, useEffect } from 'react';
import { TOAST_TIMEOUT } from '../../../constants';
import ReactDOM from 'react-dom';
import './Toast.css';

const Toast = props => {
  const [node] = useState(document.createElement('div'));

  const removeNode = () => {
    if (document.querySelector('#toast').children.length) {
      document.querySelector('#toast').childNodes[0].remove();
    }
  };

  useEffect(() => {
    if (props.show) {
      document
        .querySelector('#toast')
        .appendChild(node)
        .classList.add('toast');
      
      document
        .querySelector('.toast')
        .innerHTML = props.message;
      
      setTimeout(() => {
        removeNode();
        props.hideToast();
      }, TOAST_TIMEOUT);
    } else {
      removeNode();
    }

    return () => removeNode();
  }, [node, props]);

  return ReactDOM.createPortal(props.children, node);
};

export default Toast;