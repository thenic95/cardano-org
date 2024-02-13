import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SiteHero from "@site/src/components/SiteHero";
import WhatIsAda from '../components/WhatIsAda';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <SiteHero
        title='What is ada?'
        description={[
          'A new type of currency. A new means of transaction.',
          <br key="line1" />,
          'Direct. Secure. From Anywhere. For Everyone.',
          ]}
        bannerType ='ada'
      />
      <main>
        <WhatIsAda 
          headline='What is ada?' 
          title='Ada Is The Native Token Of Cardano'
          description={[
            'It is named after Ada Lovelace: a 19th-century mathematician who is recognized as the first \
            computer programmer, and is the daughter of the poet Lord Byron.',
            <br key="line1" />,
            <br key="line2" />,
            'Ada is a digital currency. Any user, located anywhere in the world, can use ada as a secure \
            exchange of value – without requiring a third party to mediate the exchange. Every transaction \
            is permanently, securely, and transparently recorded on the Cardano blockchain.',
            <br key="line3" />,
            <br key="line4" />,
            'Every ada holder also holds a stake in the Cardano network. Ada stored in a wallet can be delegated \
            to a stake pool to earn rewards – to participate in the successful running of the network – or found \
            and run your own stake pool to increase the pool\'s likelihood of receiving rewards. In time, ada will \
            also be usable for a variety of applications and services on the Cardano platform.',
            <br key="line5" />,
            <br key="line6" />,
          ]}
          quote='What can I do with ada?'
          
        />
      </main>
    </Layout>
  );
}
