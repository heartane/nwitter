import { dbService, storageService } from "fbase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Nweet from "components/Nweet";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";

// 로그인 후 메인 홈 화면: 트윗을 쓰는 화면
const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState(""); // 새로운 트윗 상태
  const [nweets, setNweets] = useState([]); // 트윗 목록 상태
  const [attached, setAttached] = useState(""); // 이미지 업로드 상태

  useEffect(() => {
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

  const onSubmit = async (e) => {
    e.preventDefault();

    let attachedUrl = "";
    if (attached !== "") {
      // 💡 파일 url을 가진 nweetObj 만들기
      // 1. ref 메소드로 storage에 폴더를 만들고
      // 2. uploadString 메소드로 데이터를 폴더에 넣는다.
      // uploadString() -> Upload from a String
      // attached는 넣고자하는 파일의 Data url string
      // .readAsDataURL에서 가져온 data_url format
      // 3. res는 리턴값으로 UploadTaskSnapshot이다.
      // 4. getDownloadURL 메소드로 이미지가 저장된 storage 폴더의 주소값을 얻을 수 있다.
      const attachedRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const res = await uploadString(attachedRef, attached, "data_url");
      // console.log(res);
      attachedUrl = await getDownloadURL(res.ref);
      // console.log(attachedUrl);
    }

    const nweetObj = {
      text: nweet,
      attachedUrl,
      creatorId: userObj.uid,
      createdAt: Date.now(),
    };

    try {
      const docRef = await addDoc(collection(dbService, "nweets"), nweetObj);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setNweet("");
    setAttached("");
    fileInput.current.value = "";
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader(); // file API
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttached(result);
    };
    reader.readAsDataURL(theFile);
  };
  const fileInput = useRef();
  const onClearAttached = () => {
    fileInput.current.value = ""; // 선택된 파일도 삭제
    setAttached(""); // 이미지만 없어진다.
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Nweet" />
        {attached && (
          <div>
            <img src={attached} />
            <button onClick={onClearAttached}>Clear</button>
          </div>
        )}
      </form>
      <div>
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
