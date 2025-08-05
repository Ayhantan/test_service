// src/components/ServiceDemo.tsx
import { useState, useEffect } from 'react';
import { UserService, type User } from '../services/UserService';
import { PostService, type Post } from '../services/PostService';
import { CommentService, type Comment } from '../services/CommentService';
import { ErrorHandler } from '../core/ErrorHandler';

interface LoadingState {
  users: boolean;
  posts: boolean;
  comments: boolean;
}

interface ErrorState {
  users: string | null;
  posts: string | null;
  comments: string | null;
}

export function ServiceDemo() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  
  const [loading, setLoading] = useState<LoadingState>({
    users: false,
    posts: false,
    comments: false
  });
  
  const [errors, setErrors] = useState<ErrorState>({
    users: null,
    posts: null,
    comments: null
  });

  const [selectedUserId, setSelectedUserId] = useState<number>(1);
  const [selectedPostId, setSelectedPostId] = useState<number>(1);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    setErrors(prev => ({ ...prev, users: null }));
    
    try {
      const result = await UserService.getAll();
      if (Array.isArray(result)) {
        setUsers(result);
      } else {
        setUsers([]);
      }
    } catch (error) {
      const serviceError = await ErrorHandler.handleApiError(error);
      setErrors(prev => ({ ...prev, users: ErrorHandler.getErrorMessage(serviceError) }));
      ErrorHandler.logError(serviceError, 'UserService.getAll');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(prev => ({ ...prev, posts: true }));
    setErrors(prev => ({ ...prev, posts: null }));
    
    try {
      const result = await PostService.getAll();
      if (Array.isArray(result)) {
        setPosts(result);
      } else {
        setPosts([]);
      }
    } catch (error) {
      const serviceError = await ErrorHandler.handleApiError(error);
      setErrors(prev => ({ ...prev, posts: ErrorHandler.getErrorMessage(serviceError) }));
      ErrorHandler.logError(serviceError, 'PostService.getAll');
    } finally {
      setLoading(prev => ({ ...prev, posts: false }));
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    setLoading(prev => ({ ...prev, comments: true }));
    setErrors(prev => ({ ...prev, comments: null }));
    
    try {
      const result = await CommentService.getAll();
      if (Array.isArray(result)) {
        setComments(result);
      } else {
        setComments([]);
      }
    } catch (error) {
      const serviceError = await ErrorHandler.handleApiError(error);
      setErrors(prev => ({ ...prev, comments: ErrorHandler.getErrorMessage(serviceError) }));
      ErrorHandler.logError(serviceError, 'CommentService.getAll');
    } finally {
      setLoading(prev => ({ ...prev, comments: false }));
    }
  };

  // Fetch posts by user
  const fetchPostsByUser = async (userId: number) => {
    setLoading(prev => ({ ...prev, posts: true }));
    setErrors(prev => ({ ...prev, posts: null }));
    
    try {
      const result = await PostService.getByUser(userId);
      if (Array.isArray(result)) {
        setPosts(result);
      } else {
        setPosts([]);
      }
    } catch (error) {
      const serviceError = await ErrorHandler.handleApiError(error);
      setErrors(prev => ({ ...prev, posts: ErrorHandler.getErrorMessage(serviceError) }));
      ErrorHandler.logError(serviceError, 'PostService.getByUser');
    } finally {
      setLoading(prev => ({ ...prev, posts: false }));
    }
  };

  // Fetch comments by post
  const fetchCommentsByPost = async (postId: number) => {
    setLoading(prev => ({ ...prev, comments: true }));
    setErrors(prev => ({ ...prev, comments: null }));
    
    try {
      const result = await CommentService.getByPost(postId);
      if (Array.isArray(result)) {
        setComments(result);
      } else {
        setComments([]);
      }
    } catch (error) {
      const serviceError = await ErrorHandler.handleApiError(error);
      setErrors(prev => ({ ...prev, comments: ErrorHandler.getErrorMessage(serviceError) }));
      ErrorHandler.logError(serviceError, 'CommentService.getByPost');
    } finally {
      setLoading(prev => ({ ...prev, comments: false }));
    }
  };

  // Create new user
  const createUser = async () => {
    try {
      const newUser = await UserService.create({
        name: 'Test User',
        email: 'test@example.com'
      });
      if (newUser && typeof newUser === 'object' && 'id' in newUser) {
        setUsers(prev => [...prev, newUser as User]);
      }
    } catch (error) {
      const serviceError = await ErrorHandler.handleApiError(error);
      alert(ErrorHandler.getErrorMessage(serviceError));
    }
  };

  // Load initial data
  useEffect(() => {
    fetchUsers();
    fetchPosts();
    fetchComments();
  }, []);

  const LoadingSpinner = () => (
    <div className="loading-spinner">Yükleniyor...</div>
  );

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="error-message">
      {message}
    </div>
  );

  return (
    <div className="service-demo">
      <h1>Service Manager Demo</h1>
      
      {/* Control Panel */}
      <div className="control-panel">
        <h2>Kontrol Paneli</h2>
        <div className="button-group">
          <button onClick={fetchUsers} disabled={loading.users}>
            {loading.users ? 'Yükleniyor...' : 'Kullanıcıları Yükle'}
          </button>
          <button onClick={fetchPosts} disabled={loading.posts}>
            {loading.posts ? 'Yükleniyor...' : 'Postları Yükle'}
          </button>
          <button onClick={fetchComments} disabled={loading.comments}>
            {loading.comments ? 'Yükleniyor...' : 'Yorumları Yükle'}
          </button>
          <button onClick={createUser}>Yeni Kullanıcı Oluştur</button>
        </div>
        
        <div className="control-row">
          <label>
            Kullanıcı Seç:
            <select 
              value={selectedUserId} 
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </label>
          <button onClick={() => fetchPostsByUser(selectedUserId)}>
            Bu Kullanıcının Postlarını Getir
          </button>
        </div>
        
        <div className="control-row">
          <label>
            Post Seç:
            <select 
              value={selectedPostId} 
              onChange={(e) => setSelectedPostId(Number(e.target.value))}
            >
              {posts.map(post => (
                <option key={post.id} value={post.id}>{post.title.substring(0, 30)}...</option>
              ))}
            </select>
          </label>
          <button onClick={() => fetchCommentsByPost(selectedPostId)}>
            Bu Postun Yorumlarını Getir
          </button>
        </div>
      </div>

      {/* Users Section */}
      <div className="data-section">
        <h2>Kullanıcılar ({users.length})</h2>
        {loading.users && (
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        )}
        {errors.users && (
          <div className="error-container">
            <ErrorMessage message={errors.users} />
          </div>
        )}
        {!loading.users && !errors.users && (
          <div className="cards-grid users">
            {users.map(user => (
              <div key={user.id} className="data-card">
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <small>ID: {user.id}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div className="data-section">
        <h2>Postlar ({posts.length})</h2>
        {loading.posts && (
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        )}
        {errors.posts && (
          <div className="error-container">
            <ErrorMessage message={errors.posts} />
          </div>
        )}
        {!loading.posts && !errors.posts && (
          <div className="cards-grid posts">
            {posts.map(post => (
              <div key={post.id} className="data-card">
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <small>User ID: {post.userId} | Post ID: {post.id}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="data-section">
        <h2>Yorumlar ({comments.length})</h2>
        {loading.comments && (
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        )}
        {errors.comments && (
          <div className="error-container">
            <ErrorMessage message={errors.comments} />
          </div>
        )}
        {!loading.comments && !errors.comments && (
          <div className="cards-grid comments">
            {comments.map(comment => (
              <div key={comment.id} className="data-card">
                <h4>{comment.name}</h4>
                <p>{comment.body}</p>
                <small>Email: {comment.email} | Post ID: {comment.postId}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
