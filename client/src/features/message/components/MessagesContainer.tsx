import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux"
import { sendWebsocketMessage } from "../redux/websocketMessageSlice";


const MessagesContainer = () => {
  const dispatch = useAppDispatch();

  const [message, setMessage] = useState<string>("");


  const { messages } = useAppSelector(state => state.websocketMessageReducer);
  const { userInfo } = useAppSelector(state => state.authReducer);

  const receivers = ["R1", "R2"];


  const sendMessageHandler = () => {
    const [receiver] = receivers.filter(receiver => receiver !== userInfo!.profileId);

    const msg = {
      receiverId: receiver,
      content: message
    };


    if (message === "") return;

    dispatch(sendWebsocketMessage(msg));

    setMessage("");
  }

  const setMessageHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const message = e.target.value;
    setMessage(message);
  }

  return (
    <div className="p-4 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        {!messages.length
          ? <div className="flex items-center justify-center text-3xl">
            <h2>Empty chat..</h2>
          </div>
          : messages.map((message, index) => {

            const isYou = message.senderId === userInfo!.profileId;

            return (
              <p key={index} className={`${isYou ? "text-right self-end bg-purple-700/90" : "text-left self-start bg-slate-600 "} w-[80%] text-white py-2 px-3 rounded`}>
                {message.content}
              </p>
            )
          })}

      </div>
      <div>
        <textarea onChange={setMessageHandler} className="border border-slate-300 text-slate-600 rounded py-2 px-3 outline-none focus:border-slate-500 w-full resize-none" placeholder="Message" value={message}></textarea>
        <button className="bg-purple-800 text-white font-medium px-4 py-2 rounded" onClick={sendMessageHandler}>Send message</button>
      </div>
    </div>
  )
}

export default MessagesContainer