import { dbService } from "fbase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]); // 트윗 목록 상태

  useEffect(() => {
    // 스냅샷 가져오기
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      const nweetArr = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  return (
    <div className="home_container">
      <NweetFactory userObj={userObj} />
      <div className="home_tweetList">
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
