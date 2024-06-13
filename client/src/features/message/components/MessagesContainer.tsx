import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux"
import { sendWebsocketMessage } from "../redux/websocketMessageSlice";


const MessagesContainer = () => {
  const dispatch = useAppDispatch();

  const [message, setMessage] = useState<string>("");


  const { messages } = useAppSelector(state => state.websocketMessageReducer);
  const { userInfo } = useAppSelector(state => state.authReducer);

  const [receiver, setReceiver] = useState<string>("");

  const receivers = [
    // "66061d010cfc09f329796d13",
    "65b99362b45f8f349e73f3a0"
  ];

  const sendMessageHandler = () => {
    if (receiver === "") return;

    const msg = {
      content: message,
      receiver
    };


    if (message === "") return;

    dispatch(sendWebsocketMessage(msg));

    setMessage("");
  }

  const setMessageHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const message = e.target.value;
    setMessage(message);
  }

  const setRecieverHandler = (receiverId: string) => {
    setReceiver(receiverId);
  }

  const uniqueReceivers = receivers.filter(receiver => receiver !== userInfo?.userId);

  return (
    <div className="p-4 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        {!messages.length
          ? <div className="flex items-center justify-center text-3xl">
            <h2>Empty chat..</h2>
          </div>
          : messages.map((message, index) => {

            const isYou = message.senderId === userInfo!.userId;

            return (
              <p key={index} className={`${isYou ? "text-right self-end bg-purple-700/90" : "text-left self-start bg-slate-600 "} ${message.status === "error" ? "bg-red-600" : ""} w-[80%] text-white py-2 px-3 rounded`}>
                {message.content}
              </p>
            )
          })}

      </div>
      <div>
        <textarea onChange={setMessageHandler} className="border border-slate-300 text-slate-600 rounded py-2 px-3 outline-none focus:border-slate-500 w-full resize-none" placeholder="Message" value={message}></textarea>
        <button className="bg-purple-800 text-white font-medium px-4 py-2 rounded" onClick={sendMessageHandler}>Send message</button>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {uniqueReceivers.map((getReveiver, index) => (
          <button key={index} className={`border py-1 px-2 rounded  ${getReveiver === receiver ? "text-white bg-slate-500 border-slate-600" : "bg-white border-slate-400"}`} onClick={() => setRecieverHandler(getReveiver)}>Profile {index + 1}</button>
        ))}
      </div>
    </div>
  )
}

export default MessagesContainer