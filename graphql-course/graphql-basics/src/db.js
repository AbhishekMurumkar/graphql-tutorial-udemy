// Demo comments data
let comments=[
    {
      id:'comments_1',
      text:'nice..!!',
      author:'3',
      post:'1',
    },
    {
      id:'comments_2',
      text:"shit..!!",
      author:'2',
      post:'4'
    },
    {
      id:'comments_3',
      text:'not so great, not so terrible',
      author:'4',
      post:'2'
    },
    {
      id:'comments_4',
      text:'always a loser',
      author:'1',
      post:'1'
    }
  ];
  // Demo Posts data
  let posts=[
    {
      id: '1',
      title: 'First Post',
      body: 'Content of the post',
      published: false,
      author:'1',
      comments:['1','4']
    },
    {
      id: '2',
      title: 'Some Post',
      body: 'Content...!!!',
      published: true,
      author:'2',
      comments:['3']
    },
    {
      id: '4',
      title: 'Demo Post',
      body: 'Content of the post',
      published: false,
      author:'4',
      comments:['2']
    }
  ]
  //Demo Users data
  let users=[
    {
      'id':"1",
      name:"Abhishek",
      email:"abhi@course.com",
      age:25
    },
    {
      'id':"2",
      name:"Nagarjuna",
      email:"nagarjuna@course.com",
      age:25
    },
    {
      'id':"3",
      name:"Jeevana",
      email:"jeevana@course.com",
    },
    {
      'id':"4",
      name:"Divya",
      email:"divya@course.com",
    },
  ]
  
const db={
    users,
    posts,
    comments
};
export default db;