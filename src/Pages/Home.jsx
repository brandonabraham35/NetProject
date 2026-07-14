import React from "react";
import { useEffect, useState, useContext } from "react";
import Banner from "../componets/Banner/Banner";
import Footer from "../componets/Footer/Footer";
import RowPost from "../componets/RowPost/RowPost";
import {
  originals,
  trending,
  Animated,
  trendingSeries,
  UpcomingMovies,
  becauseYouWatched,
  topPicks,
  trendingForUser
} from "../Constants/URLs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/FirebaseConfig";
import { AuthContext } from "../Context/UserContext";

function Home() {
  const { User } = useContext(AuthContext);
  const [watchedMovies, setWatchedMovies] = useState([]);

  useEffect(() => {
    getDoc(doc(db, "WatchedMovies", User.uid)).then((result) => {
      if (result.exists()) {
        const mv = result.data();
        setWatchedMovies(mv.movies);
      }
    });
  }, []);

  return (
    <div>
      <Banner url={trending}></Banner>
      <div className="w-[99%] ml-1">
        <RowPost first title="Trending" url={trending} key={trending}></RowPost>
        <RowPost title="Top Picks For You" url={topPicks} key={topPicks}></RowPost>
        <RowPost title="Trending In Your Country" url={trendingForUser} key={trendingForUser}></RowPost>
        <RowPost title="Because You Watched" url={becauseYouWatched} key={becauseYouWatched}></RowPost>

        {watchedMovies.length != 0 ? (
          <RowPost
            title="Watch History"
            movieData={watchedMovies}
            key={"Watched Movies"}
          ></RowPost>
        ) : null}

        <RowPost title="Animated" url={Animated} key={Animated}></RowPost>
        <RowPost
          title="Netflix Originals"
          islarge
          url={originals}
          key={originals}
        ></RowPost>
        <RowPost
          title="Trending Series"
          url={trendingSeries}
          key={trendingSeries}
        ></RowPost>
        <RowPost title="Upcoming Movies" url={UpcomingMovies}></RowPost>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Home;
