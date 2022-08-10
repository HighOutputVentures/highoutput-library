import { Box, Text, VStack } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { Meta, Story } from '@storybook/react';
import * as React from 'react';
import useInfiniteScroll from './useInfiniteScroll';

type Post = {
  id: string;
  body: string;
  author: string;
};

function mockPost(): Post {
  return {
    id: faker.datatype.uuid(),
    body: faker.lorem.paragraph(faker.datatype.number({ min: 2, max: 5 })),
    author: faker.name.fullName(),
  };
}

const Demo = () => {
  const targetRef = React.useRef<HTMLDivElement>(null);
  const infiniteScroll = useInfiniteScroll();

  const [posts, setPosts] = React.useState<Post[]>([
    ...new Array(30).fill(null).map(() => mockPost()),
  ]);

  const onLoadMore = async () => {
    setPosts(current => [
      ...current,
      ...new Array(10).fill(null).map(() => mockPost()),
    ]);
  };

  React.useEffect(() => {
    const target = targetRef.current;

    if (!target) return;

    infiniteScroll({
      target,
      direction: 'y',
      onLoadMore,
    });
  }, [infiniteScroll]);

  return (
    <VStack
      ref={targetRef}
      align="stretch"
      spacing={4}
      maxWidth="600px"
      height="100vh"
      marginX="auto"
      padding={8}
      overflowY="auto"
      bgColor="gray.100"
      border="1px solid"
      borderColor="gray.300"
      rounded="md"
    >
      {posts.map(post => {
        return (
          <Box
            key={post.id}
            bgColor="white"
            border="1px solid"
            borderColor="gray.300"
            padding={8}
            rounded="md"
          >
            <Text fontSize="sm" color="gray.600">
              {post.author}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {post.body}
            </Text>
          </Box>
        );
      })}
    </VStack>
  );
};

const meta: Meta = {
  title: 'Hooks/useInfiniteScroll',
  component: Demo,
};

const Template: Story = args => {
  return <Demo {...args} />;
};

export const Default = Template.bind({});
Default.args = {};

export default meta;
