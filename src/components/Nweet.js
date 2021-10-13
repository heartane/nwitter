import React, { useState } from "react";
import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { dbService, storageService } from "fbase";
import { ref, deleteObject } from "@firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [editedNweet, setEditedNweet] = useState(nweetObj.text);

  const onDeleteClick = async (e) => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await deleteDoc(doc(dbService, "nweets", nweetObj.id));
      // 이미지가 있을 경우
      if (nweetObj.attachedUrl) {
        await deleteObject(ref(storageService, nweetObj.attachedUrl));
      }
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setEditedNweet(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(dbService, "nweets", nweetObj.id), {
      text: editedNweet,
    });
    setEditing(false);
  };

  return (
    // 하나의 트윗에 수정, 삭제 버튼을 만든다.
    // 트윗 작성자만 버튼을 볼 수 있다.
    <div className="nweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              <form className="nweet_edit_form" onSubmit={onSubmit}>
                <input
                  className="nweet_edit_input"
                  type="text"
                  placeholder="Edit your nweet"
                  value={editedNweet}
                  required
                  autoFocus
                  onChange={onChange}
                />
                <input className="nweet_update" type="submit" value="Update" />
              </form>
              <span className="nweet_cancel" onClick={toggleEditing}>
                Cancel
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachedUrl && <img src={nweetObj.attachedUrl} />}
          {isOwner && (
            <div className="nweet_actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Nweet;
