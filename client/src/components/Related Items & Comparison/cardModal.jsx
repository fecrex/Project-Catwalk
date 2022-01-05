import React, {useState, forwardRef, useImperativeHandle, useCallback, useEffect} from 'react';
import {createPortal} from 'react-dom';

const modalElement = document.getElementById('modal-root');

function Modal (props, ref) {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }), [close])

  const handleEscape = useCallback(event => {
    if (event.keyCode === 27) {setIsOpen(false)}
  }, [])

  useEffect(() => {
    if (isOpen) {document.addEventListener('keydown', handleEscape, false)}
    return () => {
      document.removeEventListener('keydown', handleEscape, false)
    }
  }, [handleEscape, isOpen])

  return createPortal(
    isOpen ? <div className="modal">
      <table>
        <thead>
          <tr>
            <th>{props.original.name}</th>
            <th></th>
            <th>{props.related.name}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{props.original.default_price}</td>
            <td>Price</td>
            <td>{props.related.default_price}</td>
          </tr>
        </tbody>
      </table>
    </div> : null,
    modalElement
  )
}

export default forwardRef(Modal);
