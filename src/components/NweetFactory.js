import { addDoc, collection } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { dbService, storageService } from "fbase";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

// creating nweet part.
const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState(""); // 작성할 트윗
  const [attached, setAttached] = useState(""); // 트윗 작성 시 파일 첨부?

  const fileInput = useRef();
  const onClearAttached = () => {
    fileInput.current.value = "";
    setAttached("");
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
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };
  const onSubmit = async (e) => {
    if (nweet === "") return;
    e.preventDefault();
    let attachedUrl = "";
    if (attached !== "") {
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

  return (
    <form className="nweet_form" onSubmit={onSubmit}>
      <div className="nweet_container">
        <input
          className="nweet_input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input className="nweet_arrow" type="submit" value="&rarr;" />
      </div>
      <label className="nweet_label" for="attach-file">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        className="nweet_file"
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={fileInput}
      />
      {attached && (
        <div className="nweet_attached">
          <img className="nweet_img" src={attached} />
          <div className="nweet_clear" onClick={onClearAttached}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};
export default NweetFactory;
