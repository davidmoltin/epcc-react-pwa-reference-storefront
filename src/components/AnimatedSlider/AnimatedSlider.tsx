import { Box, Button } from "@material-ui/core";
import React from "react";
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";
import "./slider-animations.css";
import "./slider-style.css";

const content = [
  {
    title: "",
    description:
      "",
    button: "Shop Coffee Makers",
    image: "../../images/site-images/slide-banner-6.jpg",
  },
  {
    title: "Tortor Dapibus Commodo Aenean Quam",
    description:
      "Nullam id dolor id nibh ultricies vehicula ut id elit. Cras mattis consectetur purus sit amet fermentum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Donec sed odio dui.",
    button: "Discover",
    image: "https://i.imgur.com/DCdBXcq.jpg",
  },
  {
    title: "Phasellus volutpat metus",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.",
    button: "Buy now",
    image: "https://i.imgur.com/DvmN8Hx.jpg",
  }
];

export const AnimatedSlider: React.FC = (props) => {

return (
  <Box display={{ xs: '12', sm: '12', md: '12', lg: '12', xl: '12' }}>
      <Slider className="slider-wrapper" autoplay={3000}>
      {content.map((item, index) => (
        <div
          key={index}
          className="slider-content"
          style={{ background: `url('${item.image}') no-repeat center center` }}
        >
          <div className="inner">
            <h1>{item.title}</h1>
            <p>{item.description}</p>
            <Button variant="contained" color="primary">{item.button}</Button>
          </div>
        </div>
      ))}
    </Slider>
    </Box>
  );
};

export default AnimatedSlider;