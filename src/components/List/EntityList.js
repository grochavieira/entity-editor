import React, { useRef, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";

import EntityCard from "../Card/EntityCard";
import InteractionContext from "../ItemInteraction/context";

import "./styles.css";

export default function EntityList({ data, index: listIndex }) {
  const ref = useRef();
  const { move } = useContext(InteractionContext);

  const [, dropRef] = useDrop({
    accept: "CARD",
    hover(item, monitor) {
      // const draggedListIndex = item.listIndex;
      // const targetListIndex = listIndex;
      // const draggedIndex = item.index;
      // const targetIndex = index;
      // if (
      //   draggedIndex === targetIndex &&
      //   draggedListIndex === targetListIndex
      // ) {
      //   return;
      // }
      // const targetSize = ref.current.getBoundingClientRect();
      // const targetCenter = (targetSize.bottom - targetSize.top) / 2;
      // const draggedOffset = monitor.getClientOffset();
      // const draggedTop = draggedOffset.y - targetSize.top;
      // if (draggedIndex < targetIndex && draggedTop < targetCenter) {
      //   return;
      // }
      // if (draggedIndex > targetIndex && draggedTop > targetCenter) {
      //   return;
      // }
      // move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);
      // item.index = targetIndex;
      // item.listIndex = targetListIndex;
    }
  });

  return (
    <div className={`${data.type}`}>
      <span className="entity-header">{data.type}</span>

      <div ref={dropRef} className="card">
        {data.entities.map((entity, index) => {
          return (
            <EntityCard
              key={entity.entity_id}
              listIndex={listIndex}
              index={index}
              data={entity}
            />
          );
        })}
      </div>
    </div>
  );
}
