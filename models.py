

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime,JSON, Boolean, ForeignKey,Float,Date
from sqlalchemy.orm import sessionmaker, relationship ,foreign
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime,date
from werkzeug.security import generate_password_hash, check_password_hash

Base = declarative_base()
db_url = "sqlite:///students.db"



engine = create_engine(db_url,pool_size=10, max_overflow=5)


class School(Base):
    __tablename__ = 'school'
    id = Column(Integer, primary_key=True)
    owners_name=Column(String(100), nullable =False)
    school_name = Column(String(255))
    school_type =Column (String(255))
    email =Column (String(50))
    contacts =Column(String(20))
    timestamp = Column(DateTime, default=datetime.utcnow)
    timezone_id= Column(Integer,ForeignKey("timezones.id"))
    password=Column(String())
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
class Student(Base):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True)
    name = Column(Text, unique=True)
    password = Column(Text, nullable=False)
    class_id = Column(Integer, ForeignKey('classes.id'))
    profile_picture = Column(Text, default=None)
    contacts = Column(Text)
    email = Column(Text)
    admission_no=Column(String,unique=True)
    enrolled_on = Column(DateTime, default=datetime.utcnow) 
    status=Column(Text)
    transfered_on=Column(DateTime)
    parent=Column(Text)
    school_id = Column(Integer, ForeignKey('school.id'), nullable=False)

class Class(Base):
    __tablename__ = 'classes'

    id = Column(Integer, primary_key=True)
    name = Column(Text, unique=True)
    school_id = Column(Integer, ForeignKey('school.id'), nullable=False)  
class Staff(Base):
    __tablename__ = 'Staff'
    id = Column(Integer, primary_key=True)
    username = Column(Text, unique=True, nullable=False)
    password = Column(Text, nullable=False)
    class_id = Column(Integer, ForeignKey('classes.id'))
    profile_picture = Column(Text, default=None)
    contacts = Column(Text)
    email = Column(Text)
    status=Column(String)
    enrolled_on = Column(DateTime, default=datetime.utcnow)
    salary=Column(Integer)
    id_card=Column(String(255))
    staff_no=Column(String(255))
    transfered_on=Column(DateTime)
    school_id = Column(Integer, ForeignKey('school.id'), nullable=False)
    
class Borrowing(Base):
    __tablename__ = 'borrowings'

    id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey('books.id'), nullable=False)
    user_id = Column(Integer, nullable=False)
    user_type = Column(Text, nullable=False)
    borrowed_on = Column(Date, default=datetime.utcnow)
    school_id = Column(Integer, ForeignKey('school.id'), nullable=False)
    
class MaxBooks(Base):
    __tablename__ = 'max_books'

    id = Column(Integer, primary_key=True)
    user_type = Column(Text, nullable=False)
    max_quantity = Column(Integer, default=2)
    school_id = Column(Integer, ForeignKey('school.id'), nullable=False)
    
# Define the Books table
class Book(Base):
    __tablename__ = 'books'

    id = Column(Integer, primary_key=True)
    title = Column(Text, nullable=False)
    isbn_no = Column(String(), nullable=False)
    author = Column(Text, nullable=False)
    description = Column(Text)
    genre=Column(String(),)
    quantity = Column(Integer, default=1)
    out_of_stock = Column(Integer, default=0)
    due_days = Column(Integer, default=7)
    school_id = Column(Integer, ForeignKey('school.id'), nullable=False)

    
class Timezone(Base):
    __tablename__ = 'timezones'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

