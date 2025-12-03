type CreatePostsRequest = {
  posts: {
    videoUrl: string;
    shouldGenerateThumbnail: string;
    shouldGenerateShorts: string;
    scheduledTo: Date | null;
    socialsToPost: {
      id: string;
      social: string;
    }[];
  }[];
  organizationId: string;
  authorId: string;
};

export function createPosts(request: CreatePostsRequest) {
  const { organizationId, posts } = request;

  return;
}
