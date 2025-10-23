import { SiGooglemessages } from "react-icons/si";

const ChatButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick} 
      style={styles.button}
    >
      <SiGooglemessages className="w-[100%], cursor-pointer"/>
    </button>
  );
};

const styles = {
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    bottom: '80px',
    right: '30px',
    backgroundColor: '#0000FF', // Replace with the blue color used in your project
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '20px',
    cursor: 'pointer',
  }
};

export default ChatButton;