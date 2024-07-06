import {
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Input,
  Tag,
  TagLabel,
  TagRightIcon,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoAdd, IoCloseOutline } from "react-icons/io5";

import uploadImage from "../assets/upload_image.png";
import CustomModel from "../components/CustomModel";
import usePost from "../store/post.store";
import Posts from "../components/Posts";
function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    loading,
    createPost,
    successMessage,
    errorMessage,
    clearMessage,
    editPost,
  } = usePost((state) => ({
    loading: state.loading,
    createPost: state.createPost,
    successMessage: state.successMessage,
    errorMessage: state.errorMessage,
    clearMessage: state.clearMessage,
    editPost: state.editPost,
  }));
  const [tag, setTag] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [postData, setPostData] = useState({
    content: "",
    tags: [],
    image: "",
  });
  useEffect(() => {
    if (successMessage) {
      toast({
        title: "Create Post",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      clearMessage();
    }
    if (errorMessage) {
      toast({
        title: "Create Post Error",
        description: errorMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      clearMessage();
    }
  }, [errorMessage, successMessage]);

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const imgRef = useRef(null);
  const toast = useToast();
  const clearFields = useCallback(() => {
    setPostData({ content: "", tags: [], image: "" });
  }, []);
  const handleTag = (e) => {
    if (e.key === "Enter") {
      console.log("hello");
      setPostData((prev) => ({
        ...prev,
        tags: [...prev.tags, e.target.value],
      }));
      setTag("");
    }
  };
  const handleDelete = (tag) => {
    const tags = postData.tags.filter((tag1) => tag1 !== tag);
    setPostData((prev) => ({ ...prev, tags }));
  };
  const handleSave = async () => {
    if (!postData.content || postData.tags.length === 0 || !postData.image)
      return toast({
        description: "Please fill all the fields",
        position: "top-right",
        duration: 2000,
      });
    const formData = new FormData();
    formData.append("content", postData.content);
    postData.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });
    formData.append("image", postData.image, postData?.image?.name);
    await createPost(formData);
  };
  const handleEdit = async () => {
    if (!postData.content || postData.tags.length === 0 || !postData.image)
      return toast({
        description: "Please fill all the fields",
        position: "top-right",
        duration: 2000,
      });
    const formData = new FormData();
    formData.append("content", postData.content);
    postData.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });
    if (typeof postData.image === "object")
      formData.append("image", postData.image, postData?.image?.name);
    await editPost(postData.id, formData);
  };

  const handleEditOpen = useCallback((post) => {
    setPostData({
      id: post._id,
      content: post.body,
      tags: post.tags,
      image: post.image?.url,
    });
    setIsEdit(true);
    onOpen();
  }, []);
  return (
    <Box p="5" h="100vh" overflowY={"scroll"}>
      <IconButton
        icon={<IoAdd />}
        onClick={onOpen}
        variant="purple_solid"
        borderRadius={"50%"}
        position="fixed"
        bottom="70"
        right="50"
        size={"lg"}
      />
      <CustomModel
        clearFields={clearFields}
        title={"Create new Post"}
        initialRef={initialRef}
        finalRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        handleSave={handleSave}
        handleEdit={handleEdit}
        loading={loading}
        isEdit={isEdit}
      >
        <Textarea
          placeholder="Post Title"
          name="content"
          value={postData.content}
          onChange={(e) =>
            setPostData((prev) => ({ ...prev, content: e.target.value }))
          }
        />
        <HStack spacing={4} my="1">
          {postData?.tags.map((tag) => (
            <Tag
              key={tag}
              size={"md"}
              borderRadius="md"
              variant="solid"
              colorScheme="purple"
            >
              <TagLabel>{tag}</TagLabel>
              <TagRightIcon
                as={IoCloseOutline}
                cursor="pointer"
                onClick={() => handleDelete(tag)}
              />
            </Tag>
          ))}
        </HStack>
        <Input
          type="text"
          placeholder="Enter Tag"
          name="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyUp={handleTag}
        />
        <Box mt="4">
          <Box
            display="flex"
            gap="3"
            alignItems={"center"}
            justifyContent="center"
          >
            <Image
              src={
                postData.image
                  ? typeof postData.image === "string"
                    ? postData.image
                    : URL.createObjectURL(postData.image)
                  : uploadImage
              }
              borderRadius={"5"}
              width="50%"
              objectFit={"cover"}
            />
            <Input
              type="file"
              ref={imgRef}
              display={"none"}
              onChange={(e) => {
                setPostData((prev) => ({ ...prev, image: e.target.files[0] }));
              }}
            />
            <Button variant="solid" onClick={() => imgRef.current.click()}>
              Upload Image
            </Button>
          </Box>
        </Box>
      </CustomModel>
      <Posts handleEditOpen={handleEditOpen} />
    </Box>
  );
}

export default Home;
