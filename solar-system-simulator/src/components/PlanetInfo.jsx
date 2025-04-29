import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const PlanetInfoPanel = ({ planetData, onClose }) => {
  // Danh sách các thuộc tính cần hiển thị và tiêu đề tương ứng
  const properties = [
    { key: 'equatorial_diameter', label: 'EQUATORIAL DIAMETER' },
    { key: 'mass', label: 'Mass' },
    { key: 'mean_distance_from_sun', label: 'MEAN DISTANCE FROM SUN' },
    { key: 'rotation_period', label: 'ROTATION PERIOD' },
    { key: 'solar_orbit_period', label: 'SOLAR ORBIT PERIOD' },
    { key: 'surface_gravity', label: 'SURFACE GRAVITY' },
    { key: 'surface_temperature', label: 'SURFACE TEMPERATURE' },
    { key: 'temperature_summer', label: 'TEMPERATURE SUMMER' },
    { key: 'temperature_winter', label: 'TEMPERATURE WINTER' }
  ];

  // const panelStyle = {
  //   position: 'fixed',
  //   borderRadius: '10%',
  //   right: '0',
  //   top: '20%', // Bắt đầu từ 20% của màn hình
  //   height: '60%', // Chiếm 60% chiều cao màn hình
  //   width: '300px',
  //   backgroundColor: 'rgba(0, 139, 139, 0.425)', // slate-900
  //   border: '2px solid #0ff',
  //   color: 'white',
  //   padding: '0px 16px 24px 24px',
  //   overflowY: 'auto',
  //   zIndex: '50',
  //   boxSizing: 'border-box'
  // };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: '8px'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold'
  };

  const closeButtonStyle = {
    padding: '4px',
    borderRadius: '50%',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    color: 'white'
  };

  const propertyContainerStyle = {
    marginBottom: '16px'
    // paddingRight: '12px'
  };

  const scrollbarStyles = `
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
    margin: 50px;
    margin-right: 8px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 255, 0.6);
    border: 0.5em solid rgba(0, 0, 0, 0);
    // background-clip: padding-box;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 255, 255, 0.8);
  }
`;

  const propertyItemStyle = {
    borderBottom: '1px solid #334155', // slate-700
    paddingBottom: '8px',
    marginBottom: '1px'
  };

  const propertyLabelStyle = {
    fontSize: '14px',
    color: '#94a3b8', // slate-400
    marginBottom: '0px'
  };

  const propertyValueStyle = {
    fontSize: '18px'
  };

  const descriptionContainerStyle = {
    marginTop: '10px'
  };

  const descriptionLabelStyle = {
    fontSize: '14px',
    color: '#94a3b8', // slate-400
    marginBottom: '0px'
  };

  const descriptionTextStyle = {
    fontSize: '16px',
    lineHeight: '1.5'
  };

   // Đăng ký xử lý sự kiện khi component được mount
   useEffect(() => {
    // Tìm panel element sau khi component được render
    const panelElement = document.querySelector('#planet-info-panel');
    if (panelElement) {
      // Ngăn chặn sự kiện wheel lan truyền
      const preventDefaultWheel = (e) => {
        e.stopPropagation();
        // Kiểm tra nếu đã cuộn đến cạnh trên/dưới và vẫn muốn cuộn thêm
        const { scrollTop, scrollHeight, clientHeight } = panelElement;
        if (
          (scrollTop === 0 && e.deltaY < 0) || 
          (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0)
        ) {
          // Cho phép sự kiện lan truyền khi đã cuộn đến biên
          return;
        }
        // e.preventDefault();
      };
      
      panelElement.addEventListener('wheel', preventDefaultWheel, { passive: true });
      
      // Cleanup khi component bị unmount
      return () => {
        panelElement.removeEventListener('wheel', preventDefaultWheel);
      };
    }
  }, []);

  return (
    <>
      <style className='scrollbar'>{scrollbarStyles}</style>
      <div id='planet-info-panel' className="planet-info-panel-show">
        <div style={headerStyle}>
          <h2 style={titleStyle}>{planetData.name}</h2>
          <button 
            onClick={onClose}
            style={closeButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#334155'} // hover effect
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={24} />
          </button>
        </div>

        <div style={propertyContainerStyle}>
          {properties.map(({ key, label }) => (
            // Chỉ hiển thị thuộc tính nếu giá trị khác null
            planetData[key] !== null && (
              <div key={key} style={propertyItemStyle}>
                <h3 style={propertyLabelStyle}>{label}</h3>
                <p style={propertyValueStyle}>{planetData[key]}</p>
              </div>
            )
          ))}

          {/* Hiển thị mô tả nếu có */}
          {planetData.description !== null && (
            <div style={descriptionContainerStyle}>
              <h3 style={descriptionLabelStyle}>DESCRIPTION</h3>
              <p style={descriptionTextStyle}>{planetData.description}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlanetInfoPanel;