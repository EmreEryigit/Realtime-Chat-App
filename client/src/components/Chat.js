import React, { useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
const GET_MESSAGES = gql`
  query {
    messages {
      id
      user
      content
    }
  }
`;

const POST_MSG = gql`
  mutation ($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;
const SUB = gql`
  subscription {
    messages {
      id
      user
      content
    }
  }
`;
const Messages = ({ user }) => {
  const { data, subscribeToMore } = useQuery(GET_MESSAGES);
  useEffect(() => {
    subscribeToMore({
      document: SUB,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.messages[0];
        console.log(subscriptionData, prev);
        ;
      },
    });
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {data.messages.map(({ id, user: messageUser, content }) => (
        <div
          id={id}
          style={{
            display: "flex",
            justifyContent: user === messageUser ? "flex-end" : "flex-start",
          }}
        >
          <div className={user === messageUser ? "me" : "you"}>{content}</div>
        </div>
      ))}
    </div>
  );
};
const Chat = () => {
  const [state, setState] = React.useState({
    user: "Emre",
    content: "",
  });
  const [postMessage] = useMutation(POST_MSG);
  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: state,
      });
    }
    setState({
      ...state,
      content: "",
    });
  };
  return (
    <div className="messageContainer">
      <Messages user="Emre" />

      <input
        type="text"
        className="userInput"
        value={state.user}
        onChange={(e) => setState({ ...state, user: e.target.value })}
      />

      <input
        type="text"
        className="input"
        value={state.content}
        onChange={(e) => setState({ ...state, content: e.target.value })}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            onSend();
          }
        }}
      />
      <button onClick={onSend}>Send</button>
    </div>
  );
};

export default Chat;
