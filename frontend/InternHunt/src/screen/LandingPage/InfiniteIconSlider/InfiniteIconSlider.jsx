import React from "react";
import "./InfiniteIconSlider.css";

const icons = [
  { icon: `/images/airbnb.png` },
  { icon: `/images/amazon1.png` },
  { icon: `/images/apple-logo.png` },
  { icon: "/images/meta (1).png" },
  { icon: "/images/microsoft (1).png" },
  { icon: "/images/netflix.png" },
];

const icons1 = [
  { icon: "/images/spotify.png" },
  { icon: "/images/uber.png" },
  { icon: "/images/youtube.png" },
  { icon: "/images/instagram.png" },
  { icon: "/images/linkedin.png" },
  { icon: "/images/twitter.png" },
];

const icons2 = [
  { icon: "/images/snapchat.png" },
  { icon: "/images/pinterest.png" },
  { icon: "/images/paypal.png" },
  { icon: "/images/nike.png" },
  { icon: "/images/samsung.png" },
  { icon: "/images/intel.png" },
  { icon: "/images/cocacola.png" },
];

const duplicatedIcons = [...icons, ...icons];
const duplicatedIcons1 = [...icons1, ...icons1];
const duplicatedIcons2 = [...icons2, ...icons2];

const InfiniteIconSlider = () => {
  return (
    <section className="icon-slider-section" id="icon-slider-section">
      <h2 className="slider-header">
        Our <span>Company</span> Partners
      </h2>
      <div>
        <div className="slider-track-container">
          <div className="slider-track">
            {duplicatedIcons.map((item, index) => {
              return (
                <div key={index} className="icon-card">
                  <div className="icon-wrapper">
                    <div
                      className="icon"
                      style={{
                        width: "36px",
                        height: "56px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <img
                        src={item.icon}
                        alt={`Company logo ${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          console.error("Failed to load image:", item.icon);
                          e.target.style.display = "none";
                        }}
                        onLoad={() =>
                          console.log("Successfully loaded:", item.icon)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="slider-track-container">
          <div className="slider-track-1">
            {duplicatedIcons1.map((item, index) => {
              return (
                <div key={index} className="icon-card">
                  <div className="icon-wrapper">
                    <div
                      className="icon"
                      style={{
                        width: "36px",
                        height: "56px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <img
                        src={item.icon}
                        alt={`Company logo ${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          console.error("Failed to load image:", item.icon);
                          e.target.style.display = "none";
                        }}
                        onLoad={() =>
                          console.log("Successfully loaded:", item.icon)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="slider-track-container">
          <div className="slider-track-2">
            {duplicatedIcons2.map((item, index) => {
              return (
                <div key={index} className="icon-card">
                  <div className="icon-wrapper">
                    <div
                      className="icon"
                      style={{
                        width: "36px",
                        height: "56px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <img
                        src={item.icon}
                        alt={`Company logo ${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          console.error("Failed to load image:", item.icon);
                          e.target.style.display = "none";
                        }}
                        onLoad={() =>
                          console.log("Successfully loaded:", item.icon)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfiniteIconSlider;
