import {Box, Button, Text} from '@chakra-ui/react'

const NoteCard = ({id, title, content, onDelete}) => {
  return (
    <Box borderWidth={'1px'} p={4} borderRadius={'md'}>
      <Text fontWeight={'bold'}>{title} </Text>
      <Text>{content}</Text>
      <Button colorScheme={'red'} size={'sm'} onClick={()=> onDelete(id)} > Delete </Button>
    </Box>
  )
}

export default NoteCard;
