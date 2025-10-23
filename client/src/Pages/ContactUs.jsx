import { useState } from 'react';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      'service_h0zoj05',     // Replace with your EmailJS service ID
      'template_as9lgjg',     // Replace with your EmailJS template ID
      formData,
      '8cn6nF-exV4bmJQCU'    // Replace with your EmailJS user ID
    )
    .then((result) => {
      console.log("Email successfully sent:", result.text);
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Your message has been sent successfully.',
        confirmButtonColor: '#1a4d6d'
      });
    })
    .catch((error) => {
      console.error("Error sending email:", error.text);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to send message, please try again later.',
        confirmButtonColor: '#1a4d6d'
      });
    });
  };

  return (
    <div className='mt-10'>
      <Navbar/>
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#1a4d6d]">
        {/* Set Information Section */}
        <div className="lg:w-1/2 p-8">
          <h2 className="text-white text-2xl font-bold mb-2">Set Information</h2>
          <div className="bg-[#1a4d6d]/80 rounded-lg p-6 space-y-2">
            {/* Contact Information */}
            <div className="flex items-center space-x-4 text-white">
              <div className="w-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div>
                <p>Address: autocare.lk</p>
                <p>NO 139, Wanawasala Road, Colombo - 10</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <div className="w-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <p>Email us: sales@autocare.lk</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-white ml-7">
              <div className="w-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <p>+94771234567</p>
            </div>
              {/* Map Section */}
          <div className="mt-6 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.8949781689475!2d79.86124317500097!3d6.927078695991295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2592769e79eeb%3A0x4f4ec7c9f1b60602!2sNO%20139%2C%20Wanawasala%20Rd%2C%20Colombo%2010%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1697012123456!5m2!1sen!2slk"
              width="50%"
              height="300"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full border-none"
            ></iframe>
          </div>
          </div>
            {/* Form Section */}
        <div className="lg:w-1/2 p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="block text-xl font-bold mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded bg-gray-100"
                placeholder="Enter your name here"
              />
            </div>

            <div>
              <label className="block text-xl font-bold mb-2">Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded bg-gray-100"
                placeholder="Enter your email here"
              />
            </div>

            <div>
              <label className="block text-xl font-bold mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="Subject"
              />
            </div>

            <div>
              <label className="block text-xl font-bold mb-2">Your message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded h-32"
                placeholder="Say something..."
              />
            </div>

            <button
              type="submit"
              className="bg-[#1a4d6d] text-white px-8 py-2 rounded float-right hover:bg-[#153d57] transition-colors"
            >
              SEND
            </button>
          </form>
        </div>
        
        </div>

      
      </div>
    
  );
};

export default ContactForm;
