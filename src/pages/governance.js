import React, { useEffect, useMemo, useState } from "react";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import SiteHero from "@site/src/components/Layout/SiteHero";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import Divider from "@site/src/components/Layout/Divider";
import GovernanceBlueSection from "@site/src/components/GovernanceBlueSection";
import GovernancePulse from "@site/src/components/GovernancePulse";
import GovernancePathsSection from "@site/src/components/GovernancePathsSection";
import TermExplainer from "@site/src/components/TermExplainer";
import SurveyCard from "@site/src/components/SurveyCard";
import GovernanceFAQ from "@site/src/components/GovernanceFAQ";
import DelegationFlow from "@site/src/components/DelegationFlow";
import RoleCard from "@site/src/components/Layout/RoleCard";
import ConnectionLine from "@site/src/components/Layout/ConnectionLine";
import HighlightCallout from "@site/src/components/Layout/HighlightCallout";
import AppGrid from "@site/src/components/AppGrid";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";
import SpacerBox from "@site/src/components/Layout/SpacerBox";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { FaUsers, FaServer, FaUniversity, FaShieldAlt, FaCompass } from "react-icons/fa";
import {translate} from '@docusaurus/Translate';
import { makeApiClient } from "@site/src/utils/insights/api";
import { convertLovelacesToAda, sumWithdrawalAmounts } from "@site/src/utils/insights/numbers";
import styles from "./governance.module.css";
import governanceRoleSurvey from "@site/src/data/governanceRoleSurvey.json";
import governanceFAQ from "@site/src/data/governanceFAQ.json";

const confirmedNetChangeLimit = {
  amountLovelace: 350_000_000_000_000,
  startEpoch: 613,
  startDate: "13 February 2026",
  endEpoch: 713,
  endDate: "3 July 2027",
  governanceActionId: "gov_action1m3xx08yv788vfxqh6nfvrjtvmqpwezsy0ggaczctkyjmttc2wmxsq4jsr7q",
  lastChecked: "26 April 2026",
};

function formatAda(value) {
  if (value == null || Number.isNaN(Number(value))) return "...";
  const ada = Number(value);
  if (ada >= 1_000_000_000) return `${(ada / 1_000_000_000).toFixed(1)}B ada`;
  if (ada >= 1_000_000) return `${(ada / 1_000_000).toFixed(1)}M ada`;
  return `${Math.round(ada).toLocaleString()} ada`;
}

function formatPercent(value) {
  if (value == null || Number.isNaN(Number(value))) return "...";
  if (value < 0.1 && value > 0) return "<0.1%";
  return `${value.toFixed(1)}%`;
}

function GovernanceHero() {
  return (
    <SiteHero
      title={translate({id: 'governance.hero.title', message: 'Your ada, your voice'})}
      description={translate({id: 'governance.hero.description', message: "Every ada in your wallet is a vote. Thousands of people are already shaping Cardano's future. Join them."})}
      bannerType="braidBlue"
    />
  );
}

function GovernanceRolesSection() {
  const drep = (
    <RoleCard
      accent="blue"
      icon={<FaUsers />}
      title={translate({id: 'governance.onboarding.dreps.title', message: 'Delegated Representatives'})}
    >
      {translate({id: 'governance.onboarding.dreps.text', message: 'DReps vote on governance proposals on behalf of ada holders who delegate to them.'})}
    </RoleCard>
  );
  const spo = (
    <RoleCard
      accent="violet"
      icon={<FaServer />}
      title={translate({id: 'governance.onboarding.spos.title', message: 'Stake Pool Operators'})}
    >
      {translate({id: 'governance.onboarding.spos.text', message: 'SPOs validate transactions and vote on hard forks, security-critical parameters, and no-confidence motions.'})}
    </RoleCard>
  );
  const committee = (
    <RoleCard
      accent="teal"
      icon={<FaUniversity />}
      title={translate({id: 'governance.onboarding.cc.title', message: 'Constitutional Committee'})}
    >
      {translate({id: 'governance.onboarding.cc.text', message: 'The Constitutional Committee ensures that governance proposals align with Cardano\'s constitution.'})}
    </RoleCard>
  );

  return (
    <>
      <Divider text={translate({id: 'governance.divider.howItWorks', message: 'How Cardano governance works'})} id="how-it-works" />
      <SpacerBox size="small" />
      <p className="black-text">
        {translate({id: 'governance.onboarding.intro', message: 'Cardano is governed by its community. Three groups vote on proposals that shape the network. Together, they decide on everything from protocol upgrades to treasury funding.'})}
      </p>
      <SpacerBox size="small" />

      <div className={styles.rolesTriangle}>
        <div className={styles.areaDrep}>{drep}</div>
        <div className={styles.areaSpo}>{spo}</div>
        <div className={styles.areaCommittee}>{committee}</div>
        <svg
          className={styles.connections}
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="500" y1="210" x2="300" y2="430" className={styles.connLine} />
          <line x1="500" y1="210" x2="700" y2="430" className={styles.connLine} />
          <line x1="300" y1="430" x2="700" y2="430" className={styles.connLine} />
          <circle cx="500" cy="210" r="6" className={styles.connNode} />
          <circle cx="300" cy="430" r="6" className={styles.connNode} />
          <circle cx="700" cy="430" r="6" className={styles.connNode} />
        </svg>
        <ConnectionLine direction="vertical" className={styles.mobileVLine1} />
        <ConnectionLine direction="vertical" className={styles.mobileVLine2} />
      </div>

      <SpacerBox size="small" />
      <div className={styles.calloutWrap}>
        <HighlightCallout icon={<FaShieldAlt />}>
          {translate({id: 'governance.onboarding.together', message: 'Together, they represent, validate, and safeguard Cardano governance. No single group can make decisions alone.'})}
        </HighlightCallout>
      </div>
    </>
  );
}

function NclStat({ label, value, detail }) {
  return (
    <div className={styles.nclStatCard}>
      <span className={styles.nclStatValue}>{value}</span>
      <span className={styles.nclStatLabel}>{label}</span>
      {detail && <span className={styles.nclStatDetail}>{detail}</span>}
    </div>
  );
}

function NetChangeLimitSection() {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  const API_URL = customFields.CARDANO_ORG_API_URL;
  const api = useMemo(() => (API_URL ? makeApiClient(API_URL) : null), [API_URL]);

  const [currentEpoch, setCurrentEpoch] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [approvedWithdrawalCount, setApprovedWithdrawalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(Boolean(API_URL));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!api) return;
    let cancelled = false;

    async function fetchNclProgress() {
      try {
        const tipRes = await api.get("/tip");
        const epochNo = tipRes.data?.[0]?.epoch_no;
        if (cancelled) return;
        setCurrentEpoch(epochNo);

        const rangeEndEpoch = Math.min(epochNo || confirmedNetChangeLimit.startEpoch, confirmedNetChangeLimit.endEpoch);
        if (!epochNo || rangeEndEpoch < confirmedNetChangeLimit.startEpoch) {
          setWithdrawals([]);
          setApprovedWithdrawalCount(0);
          return;
        }

        const [withdrawalsRes, approvedWithdrawalsRes] = await Promise.all([
          api.get(
            `/proposal_list?proposal_type=eq.TreasuryWithdrawals&enacted_epoch=not.is.null&enacted_epoch=gte.${confirmedNetChangeLimit.startEpoch}&enacted_epoch=lte.${rangeEndEpoch}&order=enacted_epoch.desc&select=proposal_id,proposal_index,proposal_type,enacted_epoch,ratified_epoch,meta_json-%3Ebody-%3Etitle,withdrawal`
          ),
          api.get(
            `/proposal_list?proposal_type=eq.TreasuryWithdrawals&ratified_epoch=not.is.null&ratified_epoch=gte.${confirmedNetChangeLimit.startEpoch}&ratified_epoch=lte.${rangeEndEpoch}&select=proposal_id`
          ),
        ]);

        const withdrawalRows = (withdrawalsRes.data || [])
          .map((item) => ({
            amountLovelace: sumWithdrawalAmounts(item.withdrawal),
            title: item.title || translate({ id: "governance.ncl.withdrawal.untitled", message: "Untitled withdrawal" }),
            enactedEpoch: item.enacted_epoch,
            proposalId: item.proposal_id,
            proposalIndex: item.proposal_index,
          }))
          .filter((item) => item.amountLovelace > 0);

        if (cancelled) return;
        setWithdrawals(withdrawalRows);
        setApprovedWithdrawalCount((approvedWithdrawalsRes.data || []).length);
      } catch (err) {
        if (cancelled) return;
        console.error("NetChangeLimitSection: failed to fetch withdrawals", err);
        setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchNclProgress();
    return () => {
      cancelled = true;
    };
  }, [api]);

  const nclAmountAda = convertLovelacesToAda(confirmedNetChangeLimit.amountLovelace);
  const withdrawnLovelace = useMemo(
    () => withdrawals.reduce((sum, item) => sum + item.amountLovelace, 0),
    [withdrawals]
  );
  const withdrawnAda = convertLovelacesToAda(withdrawnLovelace);
  const remainingAda = Math.max(0, nclAmountAda - withdrawnAda);
  const usedPercent = nclAmountAda > 0 ? (withdrawnAda / nclAmountAda) * 100 : 0;
  const rangeEndEpoch = currentEpoch
    ? Math.min(currentEpoch, confirmedNetChangeLimit.endEpoch)
    : confirmedNetChangeLimit.endEpoch;
  const latestWithdrawals = withdrawals.slice(0, 3);
  const governanceActionUrl = `https://explorer.cardano.org/governance-action/${confirmedNetChangeLimit.governanceActionId}`;
  const dynamicDataUnavailable = hasError || !API_URL;
  const dynamicValueFallback = isLoading || dynamicDataUnavailable;

  return (
    <>
      <Divider text={translate({id: 'governance.divider.ncl', message: 'Treasury guardrails'})} id="net-change-limit" />
      <SpacerBox size="small" />
      <section className={styles.nclSection} aria-labelledby="net-change-limit-heading">
        <div className={styles.nclIntro}>
          <p className={styles.nclEyebrow}>
            {translate({ id: "governance.ncl.eyebrow", message: "Last confirmed Net Change Limit" })}
          </p>
          <h2 id="net-change-limit-heading">
            {translate({ id: "governance.ncl.title", message: "350M ada treasury withdrawal ceiling" })}
          </h2>
          <p className="black-text">
            {translate({
              id: "governance.ncl.description",
              message: "The Net Change Limit is a constitutional guardrail that caps how much ada can be withdrawn from the Cardano treasury during a defined period. Unless superseded by a new NCL, withdrawals must stay within this approved limit.",
            })}
          </p>
          <div className={styles.nclMeta}>
            <span>
              {translate(
                { id: "governance.ncl.period", message: "Epoch {startEpoch}, {startDate} to epoch {endEpoch}, {endDate}" },
                {
                  startEpoch: confirmedNetChangeLimit.startEpoch,
                  startDate: confirmedNetChangeLimit.startDate,
                  endEpoch: confirmedNetChangeLimit.endEpoch,
                  endDate: confirmedNetChangeLimit.endDate,
                }
              )}
            </span>
            <Link href={governanceActionUrl} target="_blank" rel="noopener noreferrer">
              {translate({ id: "governance.ncl.source", message: "Approved governance action" })}
            </Link>
          </div>
        </div>

        <div className={styles.nclPanel}>
          <div className={styles.nclProgressHeader}>
            <div>
              <span className={styles.nclPanelLabel}>
                {translate({ id: "governance.ncl.progress.label", message: "NCL used" })}
              </span>
              <strong>{dynamicValueFallback ? "..." : formatPercent(usedPercent)}</strong>
            </div>
            <span>
              {currentEpoch
                ? translate(
                    { id: "governance.ncl.progress.epoch", message: "Through epoch {epoch}" },
                    { epoch: rangeEndEpoch }
                  )
                : translate({ id: "governance.ncl.progress.epochFallback", message: "Latest available data" })}
            </span>
          </div>
          <div className={styles.nclProgressTrack} aria-hidden="true">
            <span style={{ width: `${Math.min(100, Math.max(0, usedPercent))}%` }} />
          </div>

          <div className={styles.nclStatsGrid}>
            <NclStat
              label={translate({ id: "governance.ncl.stat.limit", message: "NCL limit" })}
              value={formatAda(nclAmountAda)}
              detail={translate({ id: "governance.ncl.stat.limitDetail", message: "350,000,000,000,000 lovelace" })}
            />
            <NclStat
              label={translate({ id: "governance.ncl.stat.withdrawn", message: "Withdrawn so far" })}
              value={dynamicValueFallback ? "..." : formatAda(withdrawnAda)}
              detail={dynamicDataUnavailable ? translate({ id: "governance.ncl.stat.unavailable", message: "Data unavailable" }) : null}
            />
            <NclStat
              label={translate({ id: "governance.ncl.stat.remaining", message: "Remaining" })}
              value={dynamicValueFallback ? "..." : formatAda(remainingAda)}
            />
            <NclStat
              label={translate({ id: "governance.ncl.stat.count", message: "Withdrawals approved" })}
              value={dynamicValueFallback ? "..." : approvedWithdrawalCount.toLocaleString()}
              detail={
                dynamicValueFallback
                  ? null
                  : translate(
                      { id: "governance.ncl.stat.enactedDetail", message: "{count} enacted" },
                      { count: withdrawals.length.toLocaleString() }
                    )
              }
            />
          </div>

          <p className={styles.nclFootnote}>
            {translate(
              {
                id: "governance.ncl.footnote",
                message: "NCL usage is calculated from enacted Treasury Withdrawals between epochs {startEpoch} and {endEpoch}. Approved withdrawal count uses ratified Treasury Withdrawals in the same period. Confirmed NCL last checked manually: {lastChecked}.",
              },
              {
                startEpoch: confirmedNetChangeLimit.startEpoch,
                endEpoch: rangeEndEpoch,
                lastChecked: confirmedNetChangeLimit.lastChecked,
              }
            )}
          </p>
        </div>

        {latestWithdrawals.length > 0 && (
          <div className={styles.nclWithdrawals}>
            <h3>{translate({ id: "governance.ncl.withdrawals.title", message: "Latest enacted withdrawals" })}</h3>
            <ul>
              {latestWithdrawals.map((withdrawal, index) => {
                const withdrawalUrl = withdrawal.proposalId
                  ? `https://explorer.cardano.org/governance-action/${withdrawal.proposalId}`
                  : null;
                return (
                  <li key={`${withdrawal.proposalId || withdrawal.enactedEpoch}-${withdrawal.proposalIndex || index}`}>
                    <span>
                      <strong>{withdrawal.title}</strong>
                      <small>
                        {translate(
                          { id: "governance.ncl.withdrawals.epoch", message: "Epoch {epoch}" },
                          { epoch: withdrawal.enactedEpoch }
                        )}
                      </small>
                    </span>
                    <span>
                      {formatAda(convertLovelacesToAda(withdrawal.amountLovelace))}
                      {withdrawalUrl && (
                        <Link href={withdrawalUrl} target="_blank" rel="noopener noreferrer">
                          {translate({ id: "governance.ncl.withdrawals.view", message: "View" })}
                        </Link>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}


const milestones = [
  {
    titleId: "governance.impact.constitution.title",
    title: "Constitution updated with 79% support",
    textId: "governance.impact.constitution.text",
    text: "The Cardano community ratified an updated constitution through on-chain governance, introducing stricter standards for transparency and standalone accountability.",
    date: "January 2026",
    blog: "/news/2026-01-22-update-cardano-constitution",
    banner: "/img/governance/constitution.webp",
    categoryId: "governance.impact.category.constitution",
    category: "Constitution",
  },
  {
    titleId: "governance.impact.committee.title",
    title: "Constitutional Committee elected",
    textId: "governance.impact.committee.text",
    text: "The first Constitutional Committee was elected by the community through an on-chain governance action.",
    date: "September 2025",
    blog: "/news/2025-09-07-constitutional-committee-elections",
    banner: "/img/governance/committee.webp",
    categoryId: "governance.impact.category.committee",
    category: "Committee",
  },
  {
    titleId: "governance.impact.treasury.title",
    title: "Treasury withdrawals enacted",
    textId: "governance.impact.treasury.text",
    text: "The community voted to fund projects directly from the Cardano treasury, directing resources toward ecosystem growth.",
    date: "August 2025",
    blog: "/news/2025-08-07-treasury-withdrawal-actions",
    banner: "/img/governance/treasury.webp",
    categoryId: "governance.impact.category.treasury",
    category: "Treasury",
  },
  {
    titleId: "governance.impact.hardfork.title",
    title: "Hard fork proposals approved",
    textId: "governance.impact.hardfork.text",
    text: "Protocol upgrades including the Plomin hard fork were proposed and ratified through community governance.",
    date: "November 2025",
    blog: "/news/2025-11-20-hard-fork-proposal",
    banner: "/img/governance/hardfork.webp",
    categoryId: "governance.impact.category.protocol",
    category: "Protocol",
  },
  {
    titleId: "governance.impact.params.title",
    title: "Protocol parameters changed",
    textId: "governance.impact.params.text",
    text: "SPOs and DReps voted on protocol parameter changes, including stake pool economics and governance thresholds.",
    date: "February 2026",
    blog: "/news/2026-02-10-call-to-action-spo-parameter-changes",
    banner: "/img/governance/params.webp",
    categoryId: "governance.impact.category.protocol",
    category: "Protocol",
  },
];

function ImpactTimeline() {
  const { withBaseUrl } = useBaseUrlUtils();
  return (
    <>
      <Divider text={translate({id: 'governance.divider.impact', message: 'What governance has achieved'})} id="impact" />
      <SpacerBox size="small" />
      <p className="black-text">
        {translate({id: 'governance.impact.intro', message: 'Cardano governance is not theoretical. Real decisions are being made by the community every epoch.'})}
      </p>
      <SpacerBox size="small" />

      <div className={styles.timeline}>
        {milestones.map((m) => (
          <a href={m.blog} key={m.titleId} className={styles.milestoneCard}>
            <span className={styles.timelineDot} aria-hidden="true" />
            <div className={styles.milestoneBanner}>
              <img src={withBaseUrl(m.banner)} alt={translate({id: m.titleId, message: m.title})} />
            </div>
            <div className={styles.milestoneContent}>
              <span className={styles.milestoneDate}>{m.date}</span>
              <h3>{translate({id: m.titleId, message: m.title})}</h3>
              <p className="black-text">{translate({id: m.textId, message: m.text})}</p>
              <span className={styles.categoryPill}>
                {translate({id: m.categoryId, message: m.category})}
              </span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}

function ToolsGrid() {
  return (
    <>
      <Divider text={translate({id: 'governance.divider.tools', message: 'Governance tools'})} id="tools" />
      <SpacerBox size="small" />
      <p className="black-text">
        {translate({id: 'governance.tools.intro', message: 'Tools to help you participate in Cardano governance.'})}
      </p>
      <SpacerBox size="small" />
      <AppGrid
        tags={['governance']}
        showRank={false}
        showStats={false}
        ctaText={translate({id: 'governance.tools.cta', message: 'Visit'})}
        moreTitle={translate({id: 'governance.tools.more', message: 'More tools'})}
      />
    </>
  );
}

export default function Governance() {
  return (
    <Layout
      title={translate({id: 'governance.meta.title', message: 'Cardano Governance - Your ada, your voice'})}
      description={translate({id: 'governance.meta.description', message: "Cardano governance gives every ada holder a voice. Delegate to a DRep, vote on proposals, or register as a delegate representative to shape the network."})}
    >
      <OpenGraphInfo pageName="governance" />
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": governanceFAQ.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer.join(" "),
              },
            })),
          })}
        </script>
      </Head>
      <GovernanceHero />
      <main>
        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <GovernancePulse />
            <NetChangeLimitSection />
            <GovernanceRolesSection />
            <SpacerBox size="small" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <Divider text={translate({id: 'governance.divider.paths', message: 'Choose your path'})} id="paths" />
          <SpacerBox size="small" />
          <GovernancePathsSection />
          <SpacerBox size="medium" />
          <GovernanceFAQ data={governanceFAQ} />
          <SpacerBox size="medium" />
          <SurveyCard
            surveyData={governanceRoleSurvey}
            icon={<FaCompass />}
            title={translate({id: 'governance.survey.title', message: 'Not sure where to start?'})}
            description={translate({id: 'governance.survey.description', message: 'Take a short guided path to understand your options and find the governance role that fits you best.'})}
            buttonText={translate({id: 'governance.survey.buttonText', message: 'Find your role'})}
          />
          <SpacerBox size="medium" />
        </BoundaryBox>

        <BackgroundWrapper backgroundType={"solidBlue"}>
          <BoundaryBox>
            <GovernanceBlueSection />
          </BoundaryBox>
        </BackgroundWrapper>

        <BackgroundWrapper backgroundType={"zoom"}>
          <BoundaryBox>
            <ImpactTimeline />
            <SpacerBox size="medium" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <Divider text={translate({id: 'governance.divider.delegation', message: 'How to delegate'})} id="delegate-walkthrough" />
          <SpacerBox size="small" />
          <DelegationFlow storageKey="cardano-governance-delegation-step" />
          <SpacerBox size="medium" />
        </BoundaryBox>

        <BackgroundWrapper backgroundType={"gradientLight"}>
          <BoundaryBox>
            <TermExplainer category="governance" />
          </BoundaryBox>
        </BackgroundWrapper>

        <BoundaryBox>
          <ToolsGrid />
          <SpacerBox size="medium" />
        </BoundaryBox>
      </main>
    </Layout>
  );
}
