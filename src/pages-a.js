'use strict';
// Home, Team, Research — content verbatim from the captured Google Site (work/brief.json).
const { socialList } = require('./layout');

const home = {
  path: '/', title: 'Home',
  /* /assets/* is served immutable for a year, so the version marker is what
     gets a changed viewer to a returning visitor: bump it whenever
     tractogram.js changes. */
  head: '  <script src="/assets/js/tractogram.js?v=1.7" defer></script>\n',
  description: 'Lab of Marcus Kaiser at the University of Nottingham: simulating the dynamics and development of neural networks, and using focused ultrasound neuromodulation to change connectomes and improve brain function.',
  body: `
<section class="hero on-dark">
  <div class="wrap">
    <div>
      <p class="kicker">Precision Imaging · University of Nottingham</p>
      <h1>Dynamic Connectome Lab</h1>
      <p class="lede">We simulate the dynamics and development of neural networks, and use non-invasive brain stimulation — focused ultrasound neuromodulation — to change connectomes in order to improve brain function.</p>
      <div class="actions">
        <a class="btn" href="/research/">Our research</a>
        <a class="btn btn-ghost" href="/join-us/">Join the lab</a>
      </div>
    </div>
    <div class="hero-art">
      <div class="tract-stage" id="tractogram" data-lib="/assets/js/niivue.umd.js" data-tract="/assets/tracts/hcp1065.trx" data-bg="#10263B">
        <canvas aria-label="Interactive tractogram of a population-average human brain: drag to turn it"></canvas>
        <p class="tract-status" role="status">Loading the viewer…</p>
        <div class="tract-bar" hidden></div>
        <button class="tract-spin" type="button" aria-pressed="true"><i aria-hidden="true"></i><span>Spin</span></button>
      </div>
      <p class="tract-credit">Population-average tractography of the human brain — HCP1065 atlas (Yeh, 2022, CC BY-SA 4.0). Drag to turn it; colours show fibre direction.</p>
    </div>
  </div>
</section>

<section class="band-panel">
  <div class="wrap">
    <div class="facts">
      <div><b>134</b><span>Peer-reviewed journal articles</span></div>
      <div><b>600+</b><span>Researchers represented through Neuroinformatics UK, which the lab leads</span></div>
      <div><b class="sm">FUS · TMS · TIS</b><span>Neuromodulation suite next to the MRI Centre, plus vagus-nerve ultrasound</span></div>
      <div><b>QMC</b><span>School of Medicine, University of Nottingham, NG7 2UH</span></div>
    </div>
  </div>
</section>

<section>
  <div class="wrap two-col">
    <div>
      <p class="kicker">About the lab</p>
      <h2>Structure, dynamics and how to change them</h2>
    </div>
    <div class="prose">
      <p>Lab of Dr Marcus Kaiser and his team as part of the <a href="https://www.nottingham.ac.uk/research/beacons-of-excellence/precision-imaging/index.aspx" rel="noopener">Precision Imaging</a> research group. We are working on the simulation of the dynamics and development of neural networks using Neuroinformatics and network analysis tools.</p>
      <p>We aim to understand the link between structure and dynamics (e.g. for schizophrenia, depression, dementia or other network diseases) and to use non-invasive brain stimulation (focused ultrasound neuromodulation) to change connectomes in order to improve brain function.</p>
      <p>We also lead <a href="http://www.neuroinformatics.org.uk/" rel="noopener">Neuroinformatics UK</a>, representing more than 600 researchers in the fields of neuroinformatics and computational neuroscience.</p>
      <p><a class="link-arrow" href="/team/">Meet the team</a></p>
    </div>
  </div>
</section>

<section class="band-2">
  <div class="wrap">
    <div class="section-head">
      <div>
        <p class="kicker">Research</p>
        <h2>Four questions we work on</h2>
      </div>
      <p><a class="link-arrow" href="/research/">All research</a></p>
    </div>
    <div class="grid-4">
      <a class="card card-link" href="/research/#stimulation"><span class="card-num">01</span><h3>Personalised brain stimulation</h3><p>Computer simulations, based on an individual's connectome, can predict stimulation outcomes.</p><span class="card-foot link-arrow">Read more</span></a>
      <a class="card card-link" href="/research/#outcomes"><span class="card-num">02</span><h3>Predicting intervention outcomes</h3><p>Connectome information can indicate regions involved in epilepsy and predict surgery outcome.</p><span class="card-foot link-arrow">Read more</span></a>
      <a class="card card-link" href="/research/#development"><span class="card-num">03</span><h3>Connectome development in health and disease</h3><p>Spatial and temporal features can lead to small-world and modular networks; hub nodes arise early.</p><span class="card-foot link-arrow">Read more</span></a>
      <a class="card card-link" href="/research/#organisation"><span class="card-num">04</span><h3>Connectome organisation</h3><p>Hierarchical modular architecture prevents widespread activation and facilitates functional specialisation.</p><span class="card-foot link-arrow">Read more</span></a>
    </div>
  </div>
</section>

<section class="band-navy on-dark">
  <div class="wrap two-col">
    <div>
      <p class="kicker">Join us</p>
      <h2>Internships, PhDs and post-docs</h2>
      <p class="lede">The lab is interested in applicants working on focused ultrasound neuromodulation, simulating brain stimulation, large-scale network dynamics, structural and functional connectivity, and new tools for neuroimaging and connectome analysis.</p>
      <div class="actions"><a class="btn" href="/join-us/">See opportunities</a><a class="btn btn-ghost" href="/contact/">Get in touch</a></div>
    </div>
    <div>
      <p class="kicker">Follow the lab</p>
      <p class="muted">Open positions are announced on X, Bluesky and LinkedIn first.</p>
      ${socialList(['x', 'bluesky', 'linkedin', 'youtube'])}
    </div>
  </div>
</section>
`,
};

// ── Team ────────────────────────────────────────────────────────────────
const CURRENT = [
  ['Alicia Falcon Caro', 'PostDoc'],
  ['Daniel Halls', 'PostDoc'],
  ['Oliver Cattell', 'PostDoc'],
  ['Marilyn Gatica', 'Visiting PostDoc'],
  ['Zewen Chen', 'PhD student'],
  ['Mohammad Alkhawashki', 'PhD student'],
  ['Stephanos Kontogouris', 'PhD student'],
];
const ALUMNI = [
  ['James Ross', 'PostDoc'],
  ['Xue Chen', 'Visiting PhD student, now Faculty Member at Qingdao University'],
  ['Chris Hayward', 'PhD student, now PostDoc'],
  ['Joseph Necus', 'PostDoc'],
  ['Michael Mackay', 'PhD student, now clinician'],
  ['Frances Hutchings', 'PhD student, now PostDoc'],
  ['Chris Thornton', 'PhD student, now Faculty Member'],
  ['Ramtin Mehraram', 'PhD student, now PostDoc'],
  ['Roman Bauer', 'PostDoc, now Faculty Member'],
  ['Luis Peraza', 'PostDoc, now Associate Research Engineer at IXICO (London, UK)'],
  ['Christoforos Papasavvas', 'PhD student, now PostDoc'],
  ['Peter Taylor', 'PostDoc, now Associate Professor and UKRI FLF'],
  ['Yujiang Wang', 'PostDoc, now Associate Professor and UKRI FLF'],
  ['Sol Lim', 'PostDoc, now PostDoc at Cambridge University'],
  ['Henrik Kjeldsen', 'PhD student, now Associate Professor at Aarhus University'],
  ['Cheol Han', 'PostDoc, now Professor at Korea University'],
  ['Jinseop Kim', 'Visiting PostDoc, now Professor at Sungkyunkwan University (SKKU)'],
  ['Richard Tomsett', 'PhD student, now working in R&amp;D for IBM UK'],
  ['Jennifer Simonotto', 'PostDoc, now PostDoc at Imperial College London'],
  ['Iwo Bohr', 'Master thesis in Bioinformatics, now PostDoc at Cambridge University, UK'],
  ['Christoph Feenders', 'Visiting PostDoc, now Research Associate at Oldenburg University, Germany'],
  ['Blaine Keetch', 'PostDoc'],
  ['Ben Hatton', 'Research Assistant'],
  ['Yujie Wang', 'Visiting Professor'],
  ['Cyril Atkinson-Clement', 'PostDoc, now faculty at Plymouth University'],
  ['Stefan Pszczolkowski', 'PostDoc'],
];
const initials = n => n.split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();

const team = {
  path: '/team/', title: 'Team',
  description: 'The people of the Dynamic Connectome Lab at the University of Nottingham — principal investigator Marcus Kaiser, post-docs, PhD students and lab alumni.',
  body: `
<section class="hero-inner on-dark">
  <div class="wrap">
    <p class="kicker">Team</p>
    <h1>The people</h1>
    <p class="lede">Led by Marcus Kaiser, Professor of Neuroinformatics at the University of Nottingham.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head"><h2>Current members</h2><p class="muted">Eight researchers</p></div>
    <div class="people">
      <div class="person pi">
        <div class="avatar a1" aria-hidden="true">MK</div>
        <div>
          <b>Marcus Kaiser</b>
          <span>Principal Investigator · Professor of Neuroinformatics, University of Nottingham</span>
          <div class="links">
            <a href="https://www.dynamic-connectome.org/cv.html" rel="noopener">CV (html)</a>
            <a href="https://www.dynamic-connectome.org/cv.pdf" rel="noopener">CV (PDF)</a>
            <a href="https://scholar.google.com/citations?hl=en&amp;user=Ha_ZNlkAAAAJ" rel="noopener">Google Scholar</a>
            <a href="https://x.com/connectomelab" rel="noopener">X</a>
          </div>
        </div>
      </div>
      ${CURRENT.map(([n, r], i) => `<div class="person"><div class="avatar a${(i % 7) + 2}" aria-hidden="true">${initials(n)}</div><div><b>${n}</b><span>${r}</span></div></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="band-panel">
  <div class="wrap">
    <div class="section-head"><h2>Lab alumni</h2><p class="muted">${ALUMNI.length} former members and where they went</p></div>
    <ul class="alumni">
      ${ALUMNI.map(([n, r]) => `<li><b>${n}</b> — <span>${r}</span></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="band-navy on-dark">
  <div class="wrap two-col">
    <div><p class="kicker">Join us</p><h2>Want your name on this page?</h2><p class="lede">Internship, PhD and post-doc routes into the lab, with funding sources by country.</p></div>
    <div class="actions" style="margin-top:0"><a class="btn" href="/join-us/">See opportunities</a></div>
  </div>
</section>
`,
};

// ── Research ────────────────────────────────────────────────────────────
const research = {
  path: '/research/', title: 'Research',
  head: '  <script src="/assets/js/research-figs.js" defer></script>\n',
  description: 'Personalised brain stimulation, predicting intervention outcomes, connectome development, and connectome organisation — the research themes of the Dynamic Connectome Lab.',
  body: `
<section class="hero-inner on-dark">
  <div class="wrap">
    <p class="kicker">Research</p>
    <h1>Research</h1>
    <p class="lede">From the wiring of C. elegans to focused ultrasound in the human brain: four themes, one question — how does network structure shape dynamics, and how can we change it?</p>
  </div>
</section>

<section>
  <div class="wrap">
    <ul class="subnav" aria-label="On this page">
      <li><a href="#stimulation">Personalised brain stimulation</a></li>
      <li><a href="#outcomes">Predicting intervention outcomes</a></li>
      <li><a href="#development">Connectome development</a></li>
      <li><a href="#organisation">Connectome organisation</a></li>
    </ul>

    <article class="theme" id="stimulation">
      <div class="prose">
          <p class="kicker">01</p>
          <h2>Personalised brain stimulation</h2>
          <p class="finding">Computer simulations, based on an individual's connectome, can predict stimulation outcomes</p>
          <p>While many psychiatric and neurological conditions are treated with pharmaceutical drugs, side effects remain severe. Brain stimulation of distinct regions of the brain offers a potential route to new treatments. However, for neuromodulation to replace drugs in the future, interventions need to be targeted, personalised and non-invasive.</p>
          <p>We are developing computational models based on a subject's connectome to predict global neuromodulation effects. Using focused ultrasound stimulation (FUS), we develop approaches to change brain connectivity and thus cognitive function for the long-term. The aim is to improve cognitive function for mental and brain health conditions.</p>
          <p>We also develop models to predict stimulation effects at the local tissue model using the <a href="http://scholarpedia.org/article/VERTEX" rel="noopener">VERTEX brain tissue simulator</a>.</p>
        </div>
      <div class="ifig" data-fig="stimulation">
        <div class="ifig-head"><span class="pill">Interactive</span><b>Stimulation field and local field potential</b><p>An illustrative model in the spirit of the lab's VERTEX simulations: a bipolar electrode in a millimetre of tissue, the extracellular potential it creates, and the field potential a nearby recording site would see. Drag the electrode; change the current.</p></div>
      </div>
    </article>

    <article class="theme" id="outcomes">
      <div class="prose">
          <p class="kicker">02</p>
          <h2>Predicting intervention outcomes</h2>
          <p class="finding">Removal of hub nodes in simulated lesions has severe effects for network architecture</p>
          <p>Why do some lesions cause more severe deficits than others? We found that cortical networks behave similar to scale-free networks after the removal of regions or connections with drastic effects for removing network hubs (<a href="http://www.blackwell-synergy.com/doi/abs/10.1111/j.1460-9568.2007.05574.x" rel="noopener">Kaiser et al., European Journal of Neuroscience, 2007</a>).</p>
          <p class="finding">Connectome information can indicate regions involved in epilepsy and predict surgery outcome</p>
          <p>Can epileptic seizure patterns be related to brain connectivity? Based on structural connectivity for temporal lobe epilepsy, we can already predict starting points for epileptic seizures (<a href="http://www.dynamic-connectome.org/pubs/Hutchings2015PLOSCB.pdf" rel="noopener">Hutchings et al. PLOS Computational Biology, 2015</a>).</p>
          <p>Moreover, changes within regions are more informative than changes between regions for predicting surgery outcome (<a href="https://onlinelibrary.wiley.com/doi/abs/10.1002/hbm.25464" rel="noopener">Chen et al., 2021</a>).</p>
        </div>
      <div class="ifig" data-fig="roc">
        <div class="ifig-head"><span class="pill">Interactive</span><b>Predicting surgery outcome from connectivity</b><p>An illustrative ROC model whose defaults follow the published result — within-region networks (AUC 0.97) beat between-region networks (AUC 0.94) at predicting outcome (Chen et al., 2021). Move the threshold to trade sensitivity for specificity, or draw a new cohort.</p></div>
      </div>
    </article>

    <article class="theme" id="development">
      <div class="prose">
          <p class="kicker">03</p>
          <h2>Connectome development in health and disease</h2>
          <p class="finding">Spatial and temporal features can lead to small-world and modular networks</p>
          <p>A simple model for the development of networks in space, spatial growth, can generate networks with small-world properties (<a href="http://www.dynamic-connectome.org/pubs/Kaiser2004b.pdf" rel="noopener">Kaiser &amp; Hilgetag, Physical Review E, 2004</a>). The algorithm can generate networks with similar properties than cortical networks (<a href="http://www.dynamic-connectome.org/pubs/Kaiser2004c.pdf" rel="noopener">Kaiser &amp; Hilgetag, Neurocomputing, 2004</a>). However, multiple clusters only arise in few cases.</p>
          <p>The existence of multiple clusters can be secured if there are time windows for connection establishment so that some parts of the network develops earlier than others and there is a higher probability to form connections if both regions have similar time windows for synaptogenesis (<a href="https://www.dynamic-connectome.org/research/pubs/Kaiser2007NC.pdf" rel="noopener">Kaiser &amp; Hilgetag, Neurocomputing, 2007</a>).</p>
          <p class="finding">Following an old-gets-richer model, hub nodes arise early during development</p>
          <p>Observing birth-times of neurons in C. elegans we could show that 70% of long-distance connections potentially arise early on during development, before hatching when the worm only has 20% of its final body size. In addition, hub nodes were also generated early on indicating that the time that neurons have available to receive connections from later neurons can explain the increased node degree (<a href="https://www.dynamic-connectome.org/pubs/Varier2011.pdf" rel="noopener">Varier &amp; Kaiser, PLoS Computational Biology, 2011</a>). More about connectome development can be found in the MIT Press book <a href="http://mitpress.mit.edu/9780262044615/" rel="noopener">'Changing Connectomes'</a>.</p>
        </div>
      <div class="ifig" data-fig="growth">
        <div class="ifig-head"><span class="pill">Interactive</span><b>Spatial growth of a network</b><p>Neurons are born one at a time and connect to existing neurons with a probability that falls with distance (Kaiser &amp; Hilgetag, 2004). Watch small-world structure emerge; switch on time windows to get multiple clusters (Kaiser &amp; Hilgetag, 2007).</p></div>
      </div>
    </article>

    <article class="theme" id="organisation">
      <div class="prose">
          <p class="kicker">04</p>
          <h2>Connectome organisation</h2>
          <p class="finding">Hierarchical modular network architecture prevents widespread activation and facilitates functional specialisation</p>
          <p>Neural systems also show a hierarchical architecture with modules and sub-modules covering different levels of organization, from cortical columns to visual, auditory, and sensorimotor cortices (<a href="http://www.dynamic-connectome.org/pubs/Kaiser2010editorial.pdf" rel="noopener">Kaiser et al. Frontiers in Neuroinformatics, 2011</a>).</p>
          <p>Recent work includes the characterization of the specific modular organisation of human structural connectivity (<a href="http://www.dynamic-connectome.org/pubs/Kim2014.pdf" rel="noopener">Kim et al. Phil. Trans. Roy. Soc. B, 2014</a>) and an overview of network features across species (<a href="http://www.dynamic-connectome.org/pubs/Kaiser2015CurrBiol.pdf" rel="noopener">Kaiser, Current Biology, 2015</a>).</p>
          <p class="finding">Non-optimal component placement improves information propagation and switching between brain states</p>
          <p>For the human brain, regions are not positioned to minimize the total length of their connections (<a href="https://direct.mit.edu/netn/article-abstract/doi/10.1162/netn_a_00282/113279" rel="noopener">Hayward et al., 2023</a>). This nonoptimal organization, previously shown for C. elegans and rhesus monkeys (<a href="https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.0020095" rel="noopener">Kaiser &amp; Hilgetag, 2006</a>), better allows distant brain regions to communicate. In addition, this suboptimal spatial arrangement of the connectome promotes fluctuations in human brain dynamics, potentially enabling the brain to undertake flexible behavioral responses.</p>
        </div>
      <div class="ifig" data-fig="hierarchy">
        <div class="ifig-head"><span class="pill">Interactive</span><b>Hierarchical modular network and spreading activity</b><p>Modules within modules, as in the lab's models of cortical organisation. Click a node: activity spreads but stays limited. Rewire the network at random and the same activity sweeps through everything (Kaiser &amp; Hilgetag, 2010).</p></div>
      </div>
    </article>
  </div>
</section>

<section class="band-panel">
  <div class="wrap two-col">
    <div><p class="kicker">Read the papers</p><h2>Publications</h2></div>
    <div><p class="lede">134 peer-reviewed articles, searchable by year and topic, plus conference papers, book chapters and press coverage.</p><div class="actions"><a class="btn" href="/publications/">Browse publications</a><a class="btn btn-ghost on-light" href="/resources/">Data &amp; code</a></div></div>
  </div>
</section>
`,
};

module.exports = { home, team, research };
