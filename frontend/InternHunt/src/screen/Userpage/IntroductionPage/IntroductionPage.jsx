import React from "react";
import axios from "axios";
import "./IntroductionPage.css";
import TextType from "/src/ReactBuilds/TextType/TextType";
import ScrollStack, {
  ScrollStackItem,
} from "../../../ReactBuilds/ScrollStack/ScrollStack";
import CircularGallery from "/src/ReactBuilds/CircularGallery/CircularGallery";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const IntroductionPage = () => {
  const [username, setUsername] = useState("User");

  const handleCompanyClick = (companyName) => {
    // Navigate to project listings with company filter
    window.location.href = `/project-listings?company=${encodeURIComponent(
      companyName
    )}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/current-user", {
          withCredentials: true,
        });
        if (res.data.user) {
          setUsername(res.data.user.username);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <div className="introduction-main-container">
        <div className="introduction-container">
          <div className="welcome-container">
            <TextType
              text={[
                `Welcome Back ${username}, Get Working on Internships. Check out you recommended internships`,
              ]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </div>
        </div>
        <div className="search-introduction">
          <svg
            className="curvy-line"
            viewBox="0 0 40 500"
            preserveAspectRatio="none"
          >
            <path d="M 20 0 C 10 100, 30 150, 20 250 S 10 400, 20 500" />
          </svg>

          <div className="content left-side">
            <div className="text-block1">
              <h2>
                <Link to="/under-work">Check Out Your Suggestion</Link>
              </h2>
              <div className="line1"></div>
            </div>
            <div className="text-block">
              <h2>
                <a
                  href="#library"
                  style={{ textDecoration: "none", color: "inherit" }}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("library");
                    if (el)
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  Check Out What People are Talking About
                </a>
              </h2>
              <div className="line2"></div>
            </div>
          </div>

          <div className="content right-side">
            <div className="text-block">
              <h2>
                <a
                  href="/project-listings"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Browse Project Listings
                </a>
              </h2>
              <div className="line3"></div>
            </div>
          </div>
        </div>
        {/* <div className="current-hot-projects">
          <h1 className="current-project-title">Your Recommendations</h1>
          <ScrollStack>
            <ScrollStackItem>
              <h2>Card 1</h2>
              <p>This is the first card in the stack</p>
            </ScrollStackItem>
            <ScrollStackItem>
              <h2>Card 2</h2>
              <p>This is the second card in the stack</p>
            </ScrollStackItem>
            <ScrollStackItem>
              <h2>Card 3</h2>
              <p>This is the third card in the stack</p>
            </ScrollStackItem>
            <ScrollStackItem>
              <h2>Card 4</h2>
              <p>This is the fourth card in the stack</p>
            </ScrollStackItem>
            <ScrollStackItem>
              <h2>Card 5</h2>
              <p>This is the fifth card in the stack</p>
            </ScrollStackItem>
          </ScrollStack>
        </div> */}
        <div className="check-projects-container">
          <h1 className="check-projects-title">
            <a
              href="/project-listings"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Check Out Projects
            </a>
          </h1>
          <div style={{ height: "600px", position: "relative" }}>
            <CircularGallery
              bend={3}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollEase={0}
              scrollSpeed={0}
              onCompanyClick={handleCompanyClick}
            />
          </div>
        </div>
        <div className="library-container" id="library">
          <h1 className="library-title">Library</h1>
          <div className="card-grid">
            <div
              className="main-card"
              onClick={() =>
                window.open(
                  "https://www.bbc.com/news/articles/cnvmgvj4v08o",
                  "_blank"
                )
              }
            >
              <div className="overlay-text1">
                Virtual reality therapy 'helps cut chronic pain'
              </div>
            </div>
            <div
              className="small-card"
              onClick={() =>
                window.open(
                  "https://cacm.acm.org/news/how-ai-could-supercharge-ar-and-vr/",
                  "_blank"
                )
              }
            >
              <div className="overlay-text2">
                How AI Could Supercharge AR and VR
              </div>
            </div>
            <div
              className="small-card"
              onClick={() =>
                window.open(
                  "https://mbzuai.ac.ae/news/ai-and-robotics-poised-to-transform-scientific-discovery-say-global-experts/",
                  "_blank"
                )
              }
            >
              <div className="overlay-text2">
                AI and robotics poised to transform scientific discovery, say
                global experts
              </div>
            </div>
            <div
              className="small-card"
              onClick={() =>
                window.open(
                  "https://pmc.ncbi.nlm.nih.gov/articles/PMC10381749/",
                  "_blank"
                )
              }
            >
              <div className="overlay-text2">
                Augmented Reality in Maintenance—History and Perspectives
              </div>
            </div>
            <div
              className="small-card"
              onClick={() =>
                window.open(
                  "https://research.aimultiple.com/ar-in-manufacturing/",
                  "_blank"
                )
              }
            >
              <div className="overlay-text2">
                XR/AR in Manufacturing: 7 Use Cases with Examples
              </div>
            </div>
          </div>
        </div>
        <div className="review-form-container">
          <h1>
            Do You <span>Like</span> Our Page ?
          </h1>
          <p>Here's a reminder to provide a feedback to help us grow.</p>
          <ReviewForm  username = {username}/>
        </div>
      </div>
    </>
  );
};

export const ReviewForm = ({username}) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  console.log("Username: " ,username);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        reviewer_name: name,
        rating: rating,
        review_text: reviewText,
      };
      await axios.post("http://localhost:3000/api/feedback", reviewData, {
        withCredentials: true,
      });
      setSubmitted(true);
      setName("");
      setRating(0);
      setReviewText("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit feedback");
    }
  };

  if (submitted) {
    return (
      <div className="review-success">
        <h2>🎉 Thank You!</h2>
        <p>Your review has been successfully submitted.</p>
        <button onClick={() => setSubmitted(false)}>
          Submit Another Review
        </button>
      </div>
    );
  }

  return (
    <form id="review-form" onSubmit={handleSubmit}>
      <h2>Leave a Review</h2>

      {/* Name Input */}
      <label htmlFor="name">Your Name:</label>
      <input
        type="text"
        id="name"
        name="reviewer_name"
        value={username}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* Rating Stars Component */}
      <div className="rating">
        {[5, 4, 3, 2, 1].map((starValue) => (
          <React.Fragment key={starValue}>
            <input
              value={starValue}
              name="rating"
              id={`star${starValue}`}
              type="radio"
              checked={rating === starValue}
              onChange={() => setRating(starValue)}
              required
            />
            <label
              htmlFor={`star${starValue}`}
              title={`${starValue} Stars`}
            ></label>
          </React.Fragment>
        ))}
      </div>

      {/* Review Text Area */}
      <label htmlFor="review-text">Your Review:</label>
      <textarea
        id="review-text"
        name="review_text"
        rows="5"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        required
      ></textarea>

      <button type="submit">Post Review</button>
    </form>
  );
};
