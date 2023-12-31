import React from "react";
import PropTypes from "prop-types";

export default function UsersPosts({ posts }) {
  const dummyPosts = [
    {
      Pic: "https://images.pexels.com/photos/39866/entrepreneur-startup-start-up-man-39866.jpeg?auto=compress&cs=tinysrgb&w=300",
      Name: "Rohit",
      image:
        "https://images.pexels.com/photos/267961/pexels-photo-267961.jpeg?auto=compress&cs=tinysrgb&w=300",
      Text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus aspernatur asperiores cum neque vero beatae quisquam harum dolores error expedita eius eaque minima, illo at ducimus voluptatum placeat totam voluptates veritatis velit est culpa voluptatem? Voluptas in, obcaecati veritatis pariatur sequi voluptatibus ex nostrum dolores, consequuntur aliquid illo, enim sunt!",
    },
    {
      Pic: "https://images.pexels.com/photos/746386/pexels-photo-746386.jpeg?auto=compress&cs=tinysrgb&w=300",
      Name: "Rohit",
      image:
        "https://images.pexels.com/photos/746386/pexels-photo-746386.jpeg?auto=compress&cs=tinysrgb&w=300",
      Text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus aspernatur asperiores cum neque vero beatae quisquam harum dolores error expedita eius eaque minima, illo at ducimus voluptatum placeat totam voluptates veritatis velit est culpa voluptatem? Voluptas in, obcaecati veritatis pariatur sequi voluptatibus ex nostrum dolores, consequuntur aliquid illo, enim sunt!",
    },
    {
      Pic: "https://images.pexels.com/photos/39866/entrepreneur-startup-start-up-man-39866.jpeg?auto=compress&cs=tinysrgb&w=300",
      Name: "Rohit",
      image:
        "https://images.pexels.com/photos/267961/pexels-photo-267961.jpeg?auto=compress&cs=tinysrgb&w=300",
      Text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus aspernatur asperiores cum neque vero beatae quisquam harum dolores error expedita eius eaque minima, illo at ducimus voluptatum placeat totam voluptates veritatis velit est culpa voluptatem? Voluptas in, obcaecati veritatis pariatur sequi voluptatibus ex nostrum dolores, consequuntur aliquid illo, enim sunt!",
    },
    {
      Pic: "https://images.pexels.com/photos/39866/entrepreneur-startup-start-up-man-39866.jpeg?auto=compress&cs=tinysrgb&w=300",
      Name: "Rohit",
      image:
        "https://images.pexels.com/photos/1245055/pexels-photo-1245055.jpeg?auto=compress&cs=tinysrgb&w=300",
      Text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus aspernatur asperiores cum neque vero beatae quisquam harum dolores error expedita eius eaque minima, illo at ducimus voluptatum placeat totam voluptates veritatis velit est culpa voluptatem? Voluptas in, obcaecati veritatis pariatur sequi voluptatibus ex nostrum dolores, consequuntur aliquid illo, enim sunt!",
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center gap-5 mb-20 mt-7">
      {dummyPosts?.map((item, i) => {
        return (
          <React.Fragment key={i}>
            <div className="max-w-md px-4 py-3 rounded-lg shadow-sm">
              <div>
                <img
                  className="mx-auto rounded-lg w-[85vw] object-cover"
                  src={item.image}
                  alt={item.image}
                />
              </div>
              <div className="flex items-center gap-3 mt-5">
                <img
                  src={item.Pic}
                  className="object-cover w-12 h-12 rounded-full"
                  alt={item.Pic}
                />
                <h1 className="text-xl font-semibold">{item.Name}</h1>
              </div>
              <p className="mt-3 text-sm leading-6">{item.Text}</p>
            </div>
          </React.Fragment>
        );
      })}
    </main>
  );
}

UsersPosts.propTypes = {
  posts: PropTypes.array.isRequired,
};
