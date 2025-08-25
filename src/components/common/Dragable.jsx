import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const DraggableList = ({ data, getArrangedData }) => {
  const [items, setItems] = useState(data);
  const [dragging, setDragging] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    if (getArrangedData) {
      const checkedData = items.reduce((acc, item) => {
        if (item.children) {
          const checkedChildren = item.children.filter(
            child => checkedItems[child.id]
          );
          if (checkedChildren.length > 0) {
            acc.push({
              ...item,
              children: checkedChildren
            });
          }
        } else if (checkedItems[item.id]) {
          acc.push(item);
        }
        return acc;
      }, []);
      getArrangedData(checkedData);
    }
  }, [items, checkedItems]);

  const handleDragStart = (index, parentId = null) => {
    setDragging({ index, parentId });
  };

  const handleDragEnter = (index, parentId = null) => {
    if (!dragging) return;

    const newItems = [...items];

    if ((!parentId && !dragging.parentId) || parentId === dragging.parentId) {
      const sourceIndex = dragging.index;

      if (parentId) {
        const parentItem = newItems.find((item) => item.id === parentId);
        if (parentItem && parentItem.children) {
          const [draggedChild] = parentItem.children.splice(sourceIndex, 1);
          parentItem.children.splice(index, 0, draggedChild);
        }
      } else {
        const [draggedItem] = newItems.splice(sourceIndex, 1);
        newItems.splice(index, 0, draggedItem);
      }

      setDragging({ ...dragging, index });
      setItems(newItems);
    }
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleCheck = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderItem = (item, index, parentId = null) => {
    const isDragging =
      dragging?.index === index &&
      (parentId ? dragging?.parentId === parentId : !dragging?.parentId);

    if (!item.children) {
      return (
        <motion.li
          key={item.id}
          draggable
          onDragStart={(e) => {
            const dragImg = document.createElement("span");
            dragImg.style.display = "none";
            document.body.appendChild(dragImg);
            e.dataTransfer.setDragImage(dragImg, 0, 0);
            document.body.removeChild(dragImg);
            handleDragStart(index, parentId);
          }}
          onDragEnter={() => handleDragEnter(index, parentId)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          animate={{ scale: isDragging ? 0.95 : 1 }}
          transition={{ duration: 0.2 }}
          className={`
            px-3 py-1 border rounded-md cursor-move 
            bg-white hover:bg-gray-50 
            shadow-sm transition-all duration-200
            ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-200"}
            flex items-center gap-3 justify-between
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-gray-400">☰</span>
            <span className="text-md font-medium">{item.text}</span>
            <span className="text-gray-400 text-sm">{item.description}</span>
          </div>
          <Checkbox 
            checked={checkedItems[item.id] || false}
            onCheckedChange={() => handleCheck(item.id)}
          />
        </motion.li>
      );
    }

    return (
      <div
        key={item.id}
        className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
      >
        <motion.div
          draggable
          onDragStart={(e) => {
            const dragImg = document.createElement("span");
            dragImg.style.display = "none";
            document.body.appendChild(dragImg);
            e.dataTransfer.setDragImage(dragImg, 0, 0);
            document.body.removeChild(dragImg);
            handleDragStart(index);
          }}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          animate={{
            scale: isDragging ? 0.95 : 1,
            opacity: isDragging ? 0.5 : 1,
          }}
          transition={{ duration: 0.2 }}
          className={`
            px-2 py-1 cursor-pointer bg-white
            hover:bg-gray-50 flex justify-between items-center 
            transition-all duration-200
            ${isDragging ? "bg-blue-50" : ""}
          `}
        >
          <div
            className="flex items-center gap-3"
            onClick={() => toggleGroup(item.id)}
          >
            <span className="text-gray-400">☰</span>
            <div>
              <span className="text-lg font-medium">
                {item.text || item.title}
              </span>
              <span className="text-gray-400 text-sm ml-2">
                {item.description}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={checkedItems[item.id] || false}
              onCheckedChange={() => handleCheck(item.id)}
            />
          </div>
        </motion.div>

        {expandedGroups[item.id] && item.children && (
          <div className="pl-8 pr-4 py-3 space-y-2 bg-gray-50 border-t border-gray-200">
            {item.children.map((child, childIndex) =>
              renderItem(child, childIndex, item.id)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <ul className="space-y-4 mx-auto px-2">
      <AnimatePresence>
        {items.map((item, index) => renderItem(item, index))}
      </AnimatePresence>
    </ul>
  );
};

export default DraggableList;
