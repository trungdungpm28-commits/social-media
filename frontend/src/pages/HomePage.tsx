import { useCallback, useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';
import { commentApi } from '../api/commentApi';
import { postApi } from '../api/postApi';
import type { UserProfile } from '../types/auth.types';
import type { Post } from '../types/post.types';

interface HomePageProps {
  user: UserProfile;
  composerOpen: boolean;
  onOpenComposer: () => void;
  onCloseComposer: () => void;
}

const Icon = ({ name }: { name: 'like' | 'comment' | 'share' }) => {
  const paths = {
    like: <path d="M7.5 10.5V20h10.1a2 2 0 0 0 1.94-1.52l1.1-4.5A2 2 0 0 0 18.7 11h-4.2l.65-3.25A1.5 1.5 0 0 0 12.2 6.5L7.5 10.5ZM4 10h3.5v10H4z" />,
    comment: <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.1-.62L4 20l1.62-4.08A7.5 7.5 0 1 1 20 11.5Z" />,
    share: <path d="M14 4h6v6M20 4l-9 9M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h5" />,
  };

  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

const displayName = (profile: UserProfile) =>
  [profile.firstName, profile.lastName].filter(Boolean).join(' ')
  || profile.email.split('@')[0]
  || 'Social App user';

const relativeTime = (date: string) => {
  const elapsedSeconds = Math.max(0, (Date.now() - new Date(date).getTime()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ];
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  for (const [unit, seconds] of units) {
    if (elapsedSeconds >= seconds) {
      return formatter.format(-Math.floor(elapsedSeconds / seconds), unit);
    }
  }
  return 'just now';
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (message) return message;
    if (!error.response) return 'Could not connect to the server. Check your connection and try again.';
  }
  return 'Something went wrong. Please try again.';
};

export function HomePage({ user, composerOpen, onOpenComposer, onCloseComposer }: HomePageProps) {
  const [draft, setDraft] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pendingPostId, setPendingPostId] = useState<number | null>(null);
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  const [pendingCommentId, setPendingCommentId] = useState<number | null>(null);
  const [shareFeedback, setShareFeedback] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);

  const loadFeed = useCallback(async () => {
    try {
      setPosts(await postApi.getFeed());
      setError(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;
    const fetchFeed = async () => {
      try {
        const feed = await postApi.getFeed();
        if (isActive) {
          setPosts(feed);
          setError(null);
        }
      } catch (requestError) {
        if (isActive) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchFeed();
    return () => {
      isActive = false;
    };
  }, []);

  const createPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await postApi.create({
        content,
        thumbnail: thumbnail.trim() || undefined,
      });
      setDraft('');
      setThumbnail('');
      onCloseComposer();
      await loadFeed();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async (post: Post) => {
    if (pendingPostId !== null) return;
    setPendingPostId(post.id);
    setError(null);
    try {
      if (post.likes.length > 0) {
        await postApi.unlike(post.id);
      } else {
        await postApi.like(post.id);
      }
      await loadFeed();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setPendingPostId(null);
    }
  };

  const submitComment = async (event: FormEvent<HTMLFormElement>, postId: number) => {
    event.preventDefault();
    const content = (commentDrafts[postId] ?? '').trim();
    if (!content || pendingCommentId !== null) return;

    setPendingCommentId(postId);
    setError(null);
    try {
      await commentApi.create(postId, content);
      setCommentDrafts((current) => ({ ...current, [postId]: '' }));
      await loadFeed();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setPendingCommentId(null);
    }
  };

  const sharePost = async (postId: number) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/#post-${postId}`);
      setShareFeedback((current) => ({ ...current, [postId]: 'Link copied' }));
    } catch {
      setShareFeedback((current) => ({ ...current, [postId]: 'Could not copy link' }));
    }
    window.setTimeout(() => {
      setShareFeedback((current) => ({ ...current, [postId]: '' }));
    }, 1800);
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f0f2f5] px-3 py-6 sm:px-5">
      <section aria-label="News feed" className="mx-auto flex w-full max-w-[680px] flex-col gap-4">
        {error && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <section aria-label="Create a post" className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-blue-700" aria-hidden="true">
              {displayName(user).slice(0, 1).toUpperCase()}
            </span>
            <button
              type="button"
              onClick={onOpenComposer}
              className="flex-1 rounded-full bg-slate-100 px-4 py-3 text-left text-sm text-slate-500 transition hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              aria-label="Start writing a post"
            >
              What’s on your mind, {displayName(user)}?
            </button>
          </div>
          {composerOpen && (
            <form onSubmit={createPost} className="pt-4">
              <textarea
                autoFocus
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Share something with your community..."
                rows={4}
                maxLength={5000}
                className="w-full resize-y rounded-lg border border-slate-200 p-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <label htmlFor="post-thumbnail" className="mt-3 block text-sm font-medium text-slate-600">
                Add a media image (optional)
              </label>
              <input
                id="post-thumbnail"
                type="url"
                value={thumbnail}
                onChange={(event) => setThumbnail(event.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              {thumbnail.trim() && (
                <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                  <img src={thumbnail} alt="Media image preview" className="max-h-64 w-full object-cover" />
                </div>
              )}
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDraft('');
                    setThumbnail('');
                    onCloseComposer();
                  }}
                  className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!draft.trim() || submitting}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? 'Publishing…' : 'Post'}
                </button>
              </div>
            </form>
          )}
        </section>

        {loading && posts.length === 0 && (
          <p className="rounded-xl bg-white px-5 py-8 text-center text-sm text-slate-500 shadow-sm" role="status">
            Loading your feed…
          </p>
        )}

        {!loading && posts.length === 0 && (
          <p className="rounded-xl bg-white px-5 py-10 text-center text-sm text-slate-500 shadow-sm">
            Your feed is ready. Create the first post and start a conversation.
          </p>
        )}

        {posts.map((post) => {
          const liked = post.likes.length > 0;
          return (
            <article id={`post-${post.id}`} key={post.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
              <header className="flex items-center gap-3 px-4 pb-3 pt-4 sm:px-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-200 font-bold text-slate-700" aria-hidden="true">
                  {displayName(post.author).slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{displayName(post.author)}</p>
                  <time dateTime={post.createdAt} className="text-xs text-slate-500">
                    {relativeTime(post.createdAt)}
                  </time>
                </div>
              </header>

              <div className="px-4 pb-4 text-[15px] leading-6 text-slate-800 sm:px-5">
                <p className="whitespace-pre-wrap break-words">{post.content}</p>
              </div>

              {post.thumbnail && (
                <div className="max-h-[560px] overflow-hidden bg-slate-100">
                  <img
                    src={post.thumbnail}
                    alt="Post media"
                    loading="lazy"
                    className="max-h-[560px] w-full object-contain"
                  />
                </div>
              )}

              <div className="mx-4 flex items-center justify-between border-b border-slate-200 py-2 text-xs text-slate-500 sm:mx-5">
                <span>{post._count.likes} {post._count.likes === 1 ? 'like' : 'likes'}</span>
                <button
                  type="button"
                  onClick={() => setOpenComments((current) => ({ ...current, [post.id]: !current[post.id] }))}
                  className="hover:underline"
                >
                  {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                </button>
              </div>

              <div className="mx-3 grid grid-cols-3 py-1 sm:mx-5">
                <button
                  type="button"
                  aria-pressed={liked}
                  disabled={pendingPostId === post.id}
                  onClick={() => void toggleLike(post)}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition hover:bg-slate-100 disabled:opacity-50 ${liked ? 'text-blue-600' : 'text-slate-600'}`}
                >
                  <Icon name="like" /> {liked ? 'Liked' : 'Like'}
                </button>
                <button
                  type="button"
                  aria-expanded={Boolean(openComments[post.id])}
                  onClick={() => setOpenComments((current) => ({ ...current, [post.id]: !current[post.id] }))}
                  className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  <Icon name="comment" /> Comment
                </button>
                <button
                  type="button"
                  onClick={() => void sharePost(post.id)}
                  className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  <Icon name="share" /> {shareFeedback[post.id] || 'Share'}
                </button>
              </div>

              {openComments[post.id] && (
                <section aria-label={`Comments on ${displayName(post.author)}’s post`} className="border-t border-slate-100 bg-slate-50 px-4 py-4 sm:px-5">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="mb-3 flex items-start gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-700" aria-hidden="true">
                        {displayName(comment.author).slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0 rounded-2xl bg-white px-3.5 py-2.5 shadow-sm">
                        <p className="text-xs font-semibold text-slate-900">{displayName(comment.author)}</p>
                        <p className="whitespace-pre-wrap break-words text-sm leading-5 text-slate-700">{comment.content}</p>
                        <time dateTime={comment.createdAt} className="mt-1 block text-[11px] text-slate-400">
                          {relativeTime(comment.createdAt)}
                        </time>
                      </div>
                    </div>
                  ))}
                  <form onSubmit={(event) => void submitComment(event, post.id)} className="mt-3 flex items-center gap-2">
                    <input
                      aria-label="Write a comment"
                      value={commentDrafts[post.id] ?? ''}
                      onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                      placeholder="Write a comment..."
                      maxLength={2000}
                      className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      type="submit"
                      disabled={!(commentDrafts[post.id] ?? '').trim() || pendingCommentId === post.id}
                      className="rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {pendingCommentId === post.id ? 'Posting…' : 'Post'}
                    </button>
                  </form>
                </section>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
