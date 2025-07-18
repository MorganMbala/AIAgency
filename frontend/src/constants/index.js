import python from '../assets/tech/python.png';
import csharp from '../assets/tech/csharp.png';
import php from '../assets/tech/php.png';
import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    meta,
    starbucks,
    tesla,
    shopify,
    carrent,
    jobit,
    tripguide,
    threejs,
  } from "../assets";
  
 // constants/index.js
export const navLinks = [
  { id: "about",    title: "nav.about" },
  { id: "services", title: "nav.services" },   // <- changé
  { id: "contact",  title: "nav.contact" },
];

  
  
  const services = [
    {
      title: "Collaboration and Innovation",
    
      icon: web,
    },
    {
      title: "Rigor and Commitment",
      icon: mobile,
    },
    {
      title: "Fun and Creativity",
      icon: backend,
    },
    {
      title: "Excellence and Quality",
      icon: creator,
    },
    
  ];
  
  const technologies = [
    {
      name: "HTML 5",
      icon: html,
    },
    {
      name: "CSS 3",
      icon: css,
    },
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "React JS",
      icon: reactjs,
    },
    {
      name: "Redux Toolkit",
      icon: redux,
    },
    {
      name: "Tailwind CSS",
      icon: tailwind,
    },
    {
      name: "Node JS",
      icon: nodejs,
    },
    {
      name: "MongoDB",
      icon: mongodb,
    },
    {
      name: "Three JS",
      icon: threejs,
    },
    {
      name: "php",
      icon: php,
    },
    {
      name: "docker",
      icon: docker,
    },
    {
      name: "python",
      icon: python,
    },
    {
      name: "csharp",
      icon: csharp,
    },

    
  ];
  
  const experiences = [
    {
      title: "Step 1: Consultation and Planning",
      
      icon: starbucks,
      iconBg: "#383E56",
      
      points: [
        "Have a meeting with us to discuss your needs and objectives.",
        "We'll work together to agree on a detailed plan that aligns with your vision and goals.",
      ],
    },
    {
      title: "Step 2: Match with an Expert",

      icon: tesla,
      iconBg: "#E6DEDD",
    
      points: [
        "You'll be matched with an expert who specialises in your project type.",
        "They will guide you through the design process, ensuring your ideas are brought to life.",
      ],
    },
    {
      title: "Step 3: Sit Back and Relax",
    
      icon: shopify,
      iconBg: "#383E56",
     
      points: [
        "You can relax while we handle all the work.",
        "Our team of professionals will take care of every detail, providing regular updates to keep you informed.",
      ],
    },
    {
      title: "Step 4: Launch and Celebrate ",
      
      icon: meta,
      iconBg: "#E6DEDD",
    
      points: [
        "Once everything is perfect, we'll launch your site, software, or deliver your branding package.",
        "Celebrate the successful completion of your project and enjoy the results!",
      ],
    },
  ];
  
  const testimonials = [
    {
      testimonial:
        "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
      name: "Sara Lee",
      designation: "CFO",
      company: "Acme Co",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      testimonial:
        "I've never met a web developer who truly cares about their clients' success like Rick does.",
      name: "Chris Brown",
      designation: "COO",
      company: "DEF Corp",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      testimonial:
        "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
      name: "Lisa Wang",
      designation: "CTO",
      company: "456 Enterprises",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
    },
  ];
  
  const projects = [
    {
      name: "Website Development",
      description:
        "At E-WebGo, we specialise in crafting bespoke websites that not only look stunning but also function seamlessly. Our team of expert developers works closely with clients to understand their unique needs and translate them into a digital presence that captivates and engages users. From responsive design to robust e-commerce solutions, we ensure that every site we create is fast, secure, and optimised for performance. Whether you're a start-up needing your first website or an established business seeking a fresh redesign, we turn your vision into a dynamic online experience.",
      
      image: carrent,
      
    },
    {
      name: "SaaS Development",
      description:
        "E-WebGo is at the forefront of developing innovative Software as a Service (SaaS) solutions tailored to meet the specific needs of your business. Our approach combines cutting-edge technology with user-centric design to create software that enhances productivity and drives growth.From initial concept to deployment and maintenance, we handle every aspect of the development process, ensuring a seamless experience for both you and your users. Whether you need a custom CRM, project management tool, or any other SaaS product, we deliver solutions that are scalable, secure, and designed to evolve with your business.",
     
      image: jobit,
      
    },
    {
      name: "Full Scale Branding",
      description:
        "Your brand is your story, and E-WebGo is here to help you tell it powerfully and consistently. Our comprehensive branding services encompass everything from logo design and corporate identity to promotional materials like flyers and letterheads. We delve deep into your company's values and goals to create a cohesive visual identity that resonates with your target audience. With a keen eye for detail and a passion for creativity, our team ensures that every element of your brand speaks the same language, building recognition and trust across all touchpoints.",
     
      image: tripguide,
     
    },
  ];
  
  export { services, technologies, experiences, testimonials, projects };