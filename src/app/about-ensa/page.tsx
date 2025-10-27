import { Metadata } from "next";

export const metadata: Metadata = {
  title: "What is ENSA? | ENSA Tetouan | ENSA Maroc",
  description: "ENSA stands for École Nationale des Sciences Appliquées. Discover ENSA Tetouan (ENSA Maroc) - a prestigious engineering school in Morocco. Learn about ENSA university, ENSA campus life, ENSA programs, and ENSA community.",
  keywords: "ENSA, What is ENSA, ENSA Tetouan, ENSA Maroc, ENSA Morocco, ENSA university, ENSA school, ENSA campus, ENSA programs, ENSA engineering"
};

export default function AboutENSAPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <article className="bg-white border-6 shadow-brutal p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-black mb-8">
          What is ENSA? - ENSA Tetouan | ENSA Maroc
        </h1>
        
        <div className="space-y-6 text-lg">
          <section>
            <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black mb-4">
              ENSA Definition and History
            </h2>
            <p className="mb-4">
              <strong>ENSA stands for École Nationale des Sciences Appliquées</strong> (National School of Applied Sciences), 
              a network of prestigious engineering schools in Morocco. ENSA Tetouan, also known as ENSA Maroc, 
              is one of these renowned institutions offering excellence in applied sciences education.
            </p>
            <p>
              Founded to provide high-quality engineering education, ENSA institutions across Morocco, including 
              ENSA Tetouan, train future engineers who contribute to Morocco's technological and economic development.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black mb-4">
              ENSA Tetouan Location and Campus
            </h2>
            <p className="mb-4">
              <strong>ENSA Tetouan</strong> is located in Tetouan, Morocco, in the Tanger-Tetouan-Al Hoceima region. 
              The ENSA campus provides a vibrant academic environment for ENSA students pursuing engineering degrees.
            </p>
            <p>
              ENSA Tetouan's central location makes it accessible to students from across Morocco, with many 
              ENSA students and ENSA alumni forming a strong ENSA community that extends beyond graduation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black mb-4">
              ENSA Programs and Academics
            </h2>
            <div className="bg-gray-50 border-3 p-4 mb-4">
              <p className="font-bold mb-2">ENSA offers various engineering programs including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Computer Science and Engineering</li>
                <li>Industrial Engineering</li>
                <li>Civil Engineering</li>
                <li>Mechanical Engineering</li>
                <li>And other applied sciences disciplines</li>
              </ul>
            </div>
            <p>
              ENSA Tetouan provides rigorous academic training, preparing ENSA students for careers in technology, 
              innovation, and engineering sectors across Morocco and internationally.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black mb-4">
              ENSA Community and Culture
            </h2>
            <p className="mb-4">
              The <strong>ENSA community</strong> is known for its vibrant campus life, strong student organizations, 
              and active involvement in engineering projects. ENSA students often participate in competitions, 
              research projects, and community service initiatives.
            </p>
            <p>
              <strong>ENSA alumni</strong> form a network of engineering professionals across Morocco and globally, 
              contributing to the continued growth and recognition of ENSA institutions, including ENSA Tetouan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-black mb-4">
              Why Choose ENSA?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-brand-green border-3 p-4 text-black">
                <h3 className="font-bold mb-2">Quality Education</h3>
                <p>ENSA provides world-class engineering education with modern facilities and experienced faculty.</p>
              </div>
              <div className="bg-black border-3 p-4 text-white">
                <h3 className="font-bold mb-2">Career Opportunities</h3>
                <p>ENSA graduates are highly sought after in Morocco's tech and engineering sectors.</p>
              </div>
              <div className="bg-white border-3 p-4">
                <h3 className="font-bold mb-2">Strong Network</h3>
                <p>Join the ENSA alumni network spanning across Morocco and internationally.</p>
              </div>
              <div className="bg-brand-green border-3 p-4 text-black">
                <h3 className="font-bold mb-2">Campus Culture</h3>
                <p>Engage in active ENSA community with clubs, events, and student life.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 p-6 bg-black text-white border-6">
          <h3 className="text-2xl font-display font-bold uppercase tracking-tight mb-4">
            Official ENSA Merchandise
          </h3>
          <p className="mb-4">
            Show your <strong>ENSA pride</strong> with official ENSA merchandise from ENSA OFFLINE. 
            Shop ENSA hoodies, ENSA t-shirts, and ENSA apparel designed for ENSA students and ENSA alumni.
          </p>
          <a 
            href="/products" 
            className="inline-block bg-brand-green text-black border-3 px-6 py-3 font-bold uppercase hover:bg-white transition-colors"
          >
            Shop ENSA Merchandise →
          </a>
        </div>
      </article>
    </div>
  );
}

