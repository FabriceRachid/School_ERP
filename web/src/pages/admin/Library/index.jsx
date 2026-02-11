import { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { getData, saveData } from "../../../services/storage";

const Library = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Fiction",
    quantity: "",
    available: ""
  });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Fiction", "Non-Fiction", "Science", "Mathematics", "History", "Literature", "Reference"];

  useEffect(() => {
    setBooks(getData("library") || [
      {
        id: 1,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0-06-112008-4",
        category: "Fiction",
        quantity: 5,
        available: 3,
        addedDate: "2024-01-15"
      },
      {
        id: 2,
        title: "Mathematics for Engineers",
        author: "John Smith",
        isbn: "978-1-234-56789-0",
        category: "Mathematics",
        quantity: 10,
        available: 8,
        addedDate: "2024-01-20"
      }
    ]);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addBook = () => {
    if (!formData.title || !formData.author || !formData.quantity || !formData.available) {
      alert("Please fill in all required fields!");
      return;
    }
    
    const newBook = {
      id: Date.now(),
      ...formData,
      quantity: parseInt(formData.quantity),
      available: parseInt(formData.available),
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    const updated = [...books, newBook];
    setBooks(updated);
    saveData("library", updated);
    
    setFormData({ title: "", author: "", isbn: "", category: "Fiction", quantity: "", available: "" });
    setIsAdding(false);
  };

  const removeBook = (id) => {
    if (confirm("Are you sure you want to remove this book?")) {
      const updated = books.filter(b => b.id !== id);
      setBooks(updated);
      saveData("library", updated);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: books.length,
    available: books.reduce((sum, book) => sum + book.available, 0),
    categories: new Set(books.map(book => book.category)).size,
    borrowed: books.reduce((sum, book) => sum + (book.quantity - book.available), 0)
  };

  return (
    <AdminLayout>
      <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
            Library Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Manage school library books and track inventory
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6', marginBottom: '4px' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Books</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
              {stats.available}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Available</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
              {stats.borrowed}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Borrowed</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>
              {stats.categories}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Categories</div>
          </div>
        </div>

        {/* Actions Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                minWidth: '300px',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#8b5cf6';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                background: 'white',
                outline: 'none'
              }}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setIsAdding(true)}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(139, 92, 246, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(139, 92, 246, 0.2)';
            }}
          >
            <span style={{ fontSize: '16px' }}>📚</span>
            Add Book
          </button>
        </div>

        {/* Add Book Form */}
        {isAdding && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
              Add New Book
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <input
                type="text"
                name="title"
                placeholder="Book Title *"
                value={formData.title}
                onChange={handleInputChange}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              
              <input
                type="text"
                name="author"
                placeholder="Author *"
                value={formData.author}
                onChange={handleInputChange}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              
              <input
                type="text"
                name="isbn"
                placeholder="ISBN Number"
                value={formData.isbn}
                onChange={handleInputChange}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  background: 'white',
                  outline: 'none'
                }}
              >
                {categories.filter(cat => cat !== "All").map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <input
                type="number"
                name="quantity"
                placeholder="Total Quantity *"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              
              <input
                type="number"
                name="available"
                placeholder="Available *"
                value={formData.available}
                onChange={handleInputChange}
                min="0"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={addBook}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                ✅ Save Book
              </button>
              
              <button
                onClick={() => {
                  setIsAdding(false);
                  setFormData({ title: "", author: "", isbn: "", category: "Fiction", quantity: "", available: "" });
                }}
                style={{
                  background: 'white',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {filteredBooks.map((book) => (
            <div key={book.id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  📖
                </div>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '600',
                  background: '#f3f4f6',
                  color: '#6b7280'
                }}>
                  {book.category}
                </span>
              </div>
              
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '8px', lineHeight: '1.3' }}>
                {book.title}
              </h3>
              
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                by {book.author}
              </p>
              
              {book.isbn && (
                <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
                  ISBN: {book.isbn}
                </p>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Available</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#10b981' }}>
                    {book.available}/{book.quantity}
                  </div>
                </div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: book.available > 0 ? '#10b981' : '#ef4444'
                }} />
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    color: '#6b7280',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  📝 Edit
                </button>
                <button
                  onClick={() => removeBook(book.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #fecaca',
                    background: 'white',
                    color: '#ef4444',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#fef2f2';
                    e.target.style.borderColor = '#fca5a5';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.borderColor = '#fecaca';
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '64px 32px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              No books found
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
              {searchTerm || selectedCategory !== "All" ? 'Try adjusting your filters' : 'Start by adding your first book'}
            </p>
            {!searchTerm && selectedCategory === "All" && (
              <button
                onClick={() => setIsAdding(true)}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📚 Add First Book
              </button>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Library;
