'use client';
import React from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { NavLinks } from '@/constants';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { FaCheckDouble } from 'react-icons/fa';
import Footer from '@/components/Footer';

const navLinks = [
  { label: 'Home', link: '/' },
  { label: 'About', link: '/about' },
  { label: 'Services', link: '/services' },
  { label: 'Contact', link: '/contact' },
];

const about1 = [
  {
    heading: 'Fast & Efficient',
    description: 'Assess number of scripts in minutes.'
  },
  {
    heading: 'Accurate & Fair',
    description: 'AI-driven consistency in grading.'
  },
  {
    heading: 'Insightful Analytics',
    description: 'Get detailed performance insights.'
  },
  {
    heading: 'Secure & Confidential',
    description: 'Data privacy guaranteed.'
  },
  {
    heading: 'Customizable',
    description: 'Tailor grading criteria to your needs.'
  },
]

/*
How It Works
Upload your answer scripts in digital format.
Set the criteria and grading rubrics according to your needs.
Let SmartGrader assess the scripts with advanced AI algorithms.
Review and download the results and analytics.
*/

const about2 = [
  {
    description: 'Upload your answer scripts in digital format.'
  },
  {
    description: 'Set the criteria and grading rubrics according to your needs.'
  },
  {
    description: 'Let SmartGrader assess the scripts with advanced AI algorithms.'
  },
  {
    description: 'Review and download the results and analytics.'
  },
]

export default function Home() {

  return (
    <>
      <Navbar navLinks={navLinks} />
      <Main />
      <About title='Why choose AssessAI?' list={about1} imagePath='/assets/about/about1.jpg' />
      <About title='How it works?' list={about2} align='right' imagePath='/assets/about/about2.jpg' />
      <Contact />
      <Footer />
    </>
  )
}

const Main = () => {

  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  return (
    <div className='bg-[url("/assets/background-mobile.jpg")] sm:bg-[url("/assets/background.jpg")] w-full h-[94vh] sm:h-[100vh] bg-contain bg-bottom sm:bg-right-bottom bg-no-repeat'>
      <Loader visible={loading} />
      <div className='w-[80%] pt-[12vh] pl-[6vw] pr-[1vw] md:pt-[15vh]  lg:pt-[28vh] lg:pl-[10vh]'>
        <h1 className='text-3xl sm:text-6xl font-bold'>
          Welcome to AssessAI:
          <br />
          <span>Revolutionizing Education Assessment</span>
        </h1>
        <p className='mt-12 text-lg lg:text-2xl font-medium'>Unlock the Future of Learning with Automated Answer Script Assessment!</p>
        {/* 
            
      'xxs': '375px',
      'xs': '425px',
            */}

        <button
          className='w-[55%] -3xs:w-[45%] -2xs:w-[40%] xs:w-[35%] sm:w-[27%] md:w-[22%] lg:w-[18%] xl:w-[15%] 2xl:w-[12%] mt-8 px-4 py-2 bg-secondary hover:bg-secondary-dark hover:scale-[103%] rounded-md  text-center font-bold cursor-pointer'
          onClick={() => {
            setLoading(true)
            router.push('/auth/login')
          }}
        >
          Get started
        </button>



      </div>
    </div>
  )
}


const About = ({ title, align = 'left', list, imagePath }: { title: string, align?: 'left' | 'right', list: any[], imagePath: string }) => {

  const ListItem = ({ heading, description }: { heading?: string, description: string }) => {

    return (
      <div className='flex items-center gap-1 text-2xl'>
        <FaCheckDouble />
        {heading && <h2 className='font-bold'>{heading}</h2>}
        <p>{description}</p>
      </div>
    )
  }

  return (
    <section className='h-screen flex items-center'>

      <div className={`w-full flex justify-between items-center ${align === 'right' ? "flex-row-reverse" : ""}`}>

        <div className={`bg-secondary h-[calc(100vh-60px)] grid items-center  ${align === 'right' ? "pl-60 pr-16 rounded-tl-full" : "pl-16 pr-28 rounded-tr-full"}`}>

          <div className=''>
            <h1 className='text-5xl pb-8'>{title}</h1>
            <ul className='flex flex-col gap-4'>
              {list.map((item, index) => (
                <ListItem key={index} {...item} />
              ))}
            </ul>
          </div>
        </div>

        <div className=''>
          <Image
            src={imagePath}
            alt='about1'
            width={600}
            height={600}
            className={`${align === 'right' ? "rounded-r-full" : "rounded-l-full"}`}
          />
        </div>


      </div>



    </section>
  )
}

const Contact = () => {

  return (
    <section className="">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.</p>
        <form action="#" className="space-y-8">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
            <input type="email" id="email" className="shadow-sm  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 bg-primary-light dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="name@assessai.com" required/>
          </div>
          <div>
            <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subject</label>
            <input type="text" id="subject" className="block p-3 w-full text-sm text-gray-900  rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-primary-light dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Let us know how we can help you" required/>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Your message</label>
            <textarea id="message" rows={6} className="block p-2.5 w-full text-sm text-gray-900  rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-primary-light dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..."></textarea>
          </div>
          <button type="submit" className="bg-primary-light py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Send message</button>
        </form>
      </div>
    </section>
  )
}
