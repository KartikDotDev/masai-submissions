import { useEffect, useState } from "react";
import { Box, Button, Input, Textarea, VStack, SimpleGrid } from '@chakra-ui/react';
import { db } from '../firebase';
import { ref, push, onValue, remove } from "firebase/database";
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
  const [notes, SetNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const notesRef = ref(db, "notes/");
    onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedNotes = data ? Object.entries(data).map(([id, val]) => ({id, ...val})) : [];
      SetNotes(loadedNotes);
    })
  }, [])

  const deleteNote = (id) => {
    remove(ref(db, `notes/${id}`));
  }
  const addnote = () => {
    const notesRef = ref(db, 'notes/');
    push(notesRef, {title, content});
    setTitle("");
    setContent("");
  }
  return (
    <VStack spacing={4} p={4}>
      <Input placeholder="Title" 
        value={title}
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
      <Textarea placeholder="Content" 
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
      <Button onClick={addnote} > Add Note </Button> 
      <SimpleGrid columns={{base: 1, md: 2}} 

        spacing={4}
      >
        {notes.map((note) => <NoteCard key={note.id} {...note} onDelete={deleteNote} />)}
      </SimpleGrid>
    </VStack>
  )
}

export default Dashboard;
