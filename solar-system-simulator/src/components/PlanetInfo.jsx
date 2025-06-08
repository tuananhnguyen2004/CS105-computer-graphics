import { button } from "leva";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const PlanetInfoPanel = ({ planetData }) => {
  if(planetData === null) return null;
  const [isShow, setIsShow] = useState(true);
  // Danh sách các thuộc tính cần hiển thị và tiêu đề tương ứng
  // const properties = [
  //   { key: "equatorial_diameter", label: "EQUATORIAL DIAMETER" },
  //   { key: "mass", label: "Mass" },
  //   { key: "mean_distance_from_sun", label: "MEAN DISTANCE FROM SUN" },
  //   { key: "rotation_period", label: "ROTATION PERIOD" },
  //   { key: "solar_orbit_period", label: "SOLAR ORBIT PERIOD" },
  //   { key: "surface_gravity", label: "SURFACE GRAVITY" },
  //   { key: "surface_temperature", label: "SURFACE TEMPERATURE" },
  //   { key: "temperature_summer", label: "TEMPERATURE SUMMER" },
  //   { key: "temperature_winter", label: "TEMPERATURE WINTER" },
  // ];

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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 139, 139, 0.425)", // slate-900
    padding: "10px 10px",
   
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
  };

  const propertyContainerStyle = {
    height: "100%",
    padding: "20px 10px",
    overflow: "scroll",
    // paddingRight: '12px'
  };


  const propertyItemStyle = {
    borderBottom: "1px solid #334155", // slate-700
    paddingBottom: "8px",
    marginBottom: "1px",
  };

  const propertyLabelStyle = {
    fontSize: "14px",
    color: "#94a3b8", // slate-400
    marginBottom: "0px",
  };

  const propertyValueStyle = {
    fontSize: "18px",
  };

  const descriptionContainerStyle = {
    marginTop: "10px",
  };

  const descriptionLabelStyle = {
    fontSize: "14px",
    color: "#94a3b8", // slate-400
    marginBottom: "0px",
  };

  const descriptionTextStyle = {
    fontSize: "16px",
    lineHeight: "1.5",
  };

  // Đăng ký xử lý sự kiện khi component được mount
  useEffect(() => {
    // Tìm panel element sau khi component được render
    const panelElement = document.querySelector("#planet-info-panel");
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

      panelElement.addEventListener("wheel", preventDefaultWheel, {
        passive: true,
      });

      // Cleanup khi component bị unmount
      return () => {
        panelElement.removeEventListener("wheel", preventDefaultWheel);
      };
    }
  }, []);

  useEffect(() => { 
    if(planetData !== null) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  } ,[planetData])

  return (
    <>
      {isShow ? (
        <>
          <div id="planet-info-panel" className="planet-info-panel">
            <div style={headerStyle}>
              <img src={planetData.image} alt={planetData?.name} width={46} height={46} className="select_item"/>
              <span style={titleStyle}>{planetData?.name}</span>
              <button
                onClick={() => setIsShow(false)}
                className="close-button"
              >
                x
              </button>
            </div>
            <div style={propertyContainerStyle}>
              {Object.entries(planetData??{})
                ?.filter(
                  ([key, value]) =>
                    value !== null &&
                    ![
                      "id",
                      "texture",
                      "image",
                      "name",
                      "moonObject",
                      "atmosphereTexture",
                      "nightTexture",
                    ].includes(key)
                )
                ?.map(([key, value]) => (
                  <div key={key} style={propertyItemStyle}>
                    <h3 style={propertyLabelStyle}>
                      {key.replace("_", " ").toUpperCase()}
                    </h3>
                    <p style={propertyValueStyle}>{value}</p>
                  </div>
                ))}
            </div>
          </div>
        </>
      ) : (
        <button className="display-button" onClick={()=>setIsShow(true)}>&lt;</button>
      )}
    </>
  );
};

export default PlanetInfoPanel;
