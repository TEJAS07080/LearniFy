// src/components/CustomCursor.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./CustomCursor.css";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    // Update the cursor and follower positions with a bouncy effect
    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.02,
        ease: "power4.out",
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)",
      });
    };

    // Enlarge both cursor and follower on hover
    const hoverEffect = () => {
      gsap.to(cursor, { scale: 1.4, duration: 0.2, ease: "elastic.out(1, 0.5)" });
      gsap.to(follower, { scale: 1.4, duration: 0.2, ease: "elastic.out(1, 0.5)", borderWidth: 2 });
    };

    const removeHoverEffect = () => {
      gsap.to(cursor, { scale: 1, duration: 0.15, ease: "power3.out" });
      gsap.to(follower, { scale: 1, duration: 0.15, ease: "power3.out", borderWidth: 2 });
    };

    // Add event listeners
    window.addEventListener("mousemove", moveCursor);

    // Add hover effect to all clickable elements
    const clickableElements = document.querySelectorAll(
      'a, button, [role="button"], input[type="submit"], input[type="button"], .clickable'
    );

    clickableElements.forEach((el) => {
      el.addEventListener("mouseenter", hoverEffect);
      el.addEventListener("mouseleave", removeHoverEffect);
    });

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      clickableElements.forEach((el) => {
        el.removeEventListener("mouseenter", hoverEffect);
        el.removeEventListener("mouseleave", removeHoverEffect);
      });
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-follower" ref={followerRef}></div>
    </>
  );
};

export default CustomCursor;
