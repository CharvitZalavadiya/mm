
interface Note {
    _id: string;
    id: string;
    title: string;
    description: string;
   color: string;
  }

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    note?: Note | null;
  }
  
 const NotePopup: React.FC<PopupProps> = ({ isOpen, onClose, note }) =>  {
    // if (!isOpen || !note) return null;
  
    return (
      <div>
        hello world
      </div>
    );
  };

  export default NotePopup