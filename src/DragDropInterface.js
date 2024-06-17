import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import he from 'he';
import './index.css';

const DragDropInterface = ({ productId }) => {
  const [error, setError] = useState(null);
  const [mv, setMv] = useState('JAPANESE');
  const [fields, setFields] = useState([]);
  const mvOptions = [
    "CHINESE-S", "CHINESE-T", "GERMAN", "FRENCH", "JAPANESE",
    "ITALIAN", "KOREAN", "PORT-EUR", "SPAN-EUR", "INDONESIAN"
  ];

  useEffect(() => {
    fetchData();
  }, [productId, mv]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://atlas.atdw-online.com.au/api/atlas/product', {
        params: {
          key: 'ATDW001',
          productid: productId,
          mv: mv,
          out: 'json'
        }
      });

      const decodedData = {};
      for (const key in response.data) {
        if (response.data.hasOwnProperty(key)) {
          const value = response.data[key];
          decodedData[key] = typeof value === 'string' ? he.decode(value) : value;
        }
      }

      const multimedia = response.data.multimedia || [];
      const firstImage = multimedia.find(media => media.attributeIdMultimediaContent === 'IMAGE');

      const newFields = [
        { id: 'productName', label: 'Product Name', value: decodedData.productName },
        { id: 'productNameMv', label: 'Product Name MV', value: decodedData.productNameMv },
        { id: 'productDescriptionMv', label: 'Product Description MV', value: decodedData.productDescriptionMv },
        { id: 'productShortDescriptionMv', label: 'Product Short Description MV', value: decodedData.productShortDescriptionMv },
        { id: 'productCategoryDescriptionMv', label: 'Product Category Description MV', value: decodedData.productCategoryDescriptionMv },
      ];

      if (firstImage) {
        newFields.push({ id: 'heroImage', label: 'Hero Image', value: firstImage.serverPath, isImage: true });
      }

      setFields(newFields);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFields(items);
  };

  return (
    <div className="container">
      <div className="input-box">
        <div className="field">
          <label className="label">Market Variant (MV):</label>
          <select 
            value={mv} 
            onChange={(e) => setMv(e.target.value)}
          >
            {mvOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
        {error && <p>Error: {error.message}</p>}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(providedDroppable) => (
            <div
              className="grid-container"
              {...providedDroppable.droppableProps}
              ref={providedDroppable.innerRef}
            >
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(providedDraggable, snapshot) => (
                    <div
                      className={`field ${snapshot.isDragging ? 'dragging' : ''}`}
                      ref={providedDraggable.innerRef}
                      {...providedDraggable.draggableProps}
                      {...providedDraggable.dragHandleProps}
                      style={{
                        ...providedDraggable.draggableProps.style,
                        gridColumnEnd: field.gridColumnEnd || 'span 1',
                        gridRowEnd: field.gridRowEnd || 'span 1'
                      }}
                    >
                      <p>
                        <span className="label">{field.label}:</span>
                        <br />
                        {field.isImage ? (
                          <img src={field.value} alt={field.label} style={{ maxWidth: '100%' }} />
                        ) : (
                          field.value
                        )}
                      </p>
                    </div>
                  )}
                </Draggable>
              ))}
              {providedDroppable.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DragDropInterface;
