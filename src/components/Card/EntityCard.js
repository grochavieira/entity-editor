import React, { useRef, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";

import InteractionContext from "../ItemInteraction/context";

import "./styles.css";

export default function EntityCard({ data, index, listIndex }) {
  const ref = useRef();
  const { move } = useContext(InteractionContext);

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: "CARD", index, listIndex },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, dropRef] = useDrop({
    accept: "CARD",
    hover(item, monitor) {
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;

      const draggedIndex = item.index;
      const targetIndex = index;

      if (
        draggedIndex === targetIndex &&
        draggedListIndex === targetListIndex
      ) {
        return;
      }

      const targetSize = ref.current.getBoundingClientRect();
      const targetCenterY = (targetSize.bottom - targetSize.top) / 2;

      const draggedOffset = monitor.getClientOffset();
      const draggedTop = draggedOffset.y - targetSize.top;

      const targetCenterX = (targetSize.left - targetSize.right) / 2;

      const draggedLeft = draggedOffset.x - targetSize.right;

      if (draggedIndex < targetIndex && draggedTop < targetCenterY) {
        return;
      }

      if (draggedIndex > targetIndex && draggedTop > targetCenterY) {
        return;
      }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);

      item.index = targetIndex;
      item.listIndex = targetListIndex;
    }
  });

  dragRef(dropRef(ref));

  return (
    <div
      ref={ref}
      className={`${data.object_type} ${isDragging ? "draggedin" : ""}`}
    >
      <p>name: {data.entity_name}</p>
      <p>id: {data.entity_id}</p>
    </div>
  );
}
