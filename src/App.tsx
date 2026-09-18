import cognition12 from './assets/cognition-12h.png';
import cognition24 from './assets/cognition-24h.png';
import effervescent from './assets/effervescent.png';
import patch from './assets/patch.png';
import suppositoire from './assets/suppositoire.png';
import telepathie from './assets/Télépathie.png';
import vitesse from './assets/Vitesse.png';
import { type ComponentType, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowLeft, ArrowRight, Dumbbell, EyeOff, Zap, ChevronRight, Brain, Activity, ShieldAlert, Pill, Circle, Bandage, Droplet, Focus, Armchair, BicepsFlexed, Hourglass, Sparkles, Flame } from 'lucide-react';

const capsule=`${import.meta.env.BASE_URL}assets/capsule.png`;
const cognitionCapsule=`${import.meta.env.BASE_URL}assets/super-cognition.png`;
function Wing({size=24}:{size?:number}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 20c1-6 4-9 9-11 4-2 6-4 9-7 0 7-3 15-10 17H7"/><path d="m7 17 8-7M10 18l7-5M13 17l5-2"/></svg>}
function TelepathyIcon({size=24}:{size?:number}){return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 28v-6C0 19 1 10 6 9c4-1 6 2 6 5l2 4-3 1v4H7v5M29 28v-6c3-3 2-12-3-13-4-1-6 2-6 5l-2 4 3 1v4h4v5"/><path d="M13 6q3-3 6 0M14 10q2-2 4 0M11 3q5-4 10 0"/></svg>}
function LanguageIcon({size=24}:{size?:number}){return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 29v-6C0 19 1 9 7 8c4 0 6 3 6 6l3 4-4 1v4H8v6M17 16l3-2M18 20l3 1"/><text x="20" y="11" fill="currentColor" stroke="none" fontSize="10" fontFamily="sans-serif">A</text><text x="24" y="24" fill="currentColor" stroke="none" fontSize="9" fontFamily="sans-serif">B</text></svg>}
function DreamIcon({size=24}:{size?:number}){return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 25h24v4H3zM7 24c-5-4-3-13 3-14 7-2 12 3 12 8l3 3-4 1-1 3M15 20q2 2 4 0M10 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/><text x="19" y="7" fill="currentColor" stroke="none" fontSize="8" fontFamily="sans-serif">Z</text><text x="26" y="12" fill="currentColor" stroke="none" fontSize="6" fontFamily="sans-serif">zz</text></svg>}
const emotionIcons:Record<string,typeof Focus>={Confiant:Sparkles,Zen:Armchair,'Énergisé':Zap,'Concentré':Focus,Patient:Hourglass,'En colère':Flame};

type Step='hero'|'power'|'emotion'|'admin'|'duration'|'quantity'|'recap';
const steps=['Votre pouvoir','Votre émotion','Mode d’administration','Durée d’action','Quantité','Récapitulatif'];
const screenByNode: Record<string,Step>={
  '1-278':'hero','1-288':'power','1-370':'power','1-698':'power','1-452':'emotion','1-524':'admin','1-596':'duration','1-650':'quantity',
  '1-245':'recap','1-81':'power','1-48':'power','1-59':'power','1-830':'power','1-804':'power','1-856':'power','1-779':'power','1-890':'power','1-889':'power',
  '1-915':'power','1-151':'power','1-58':'power','1-182':'power','1-118':'power','1-70':'power','1-69':'power','1-878':'power','1-215':'power'
};

const emotions=['Confiant','Zen','Énergisé','Concentré','En colère'];
const admins=['Gélule','Effervescent','Patch','Suppositoire'];
const destinations:Step[]=['power','emotion','admin','duration','quantity','recap'];
const doses:Record<string,string>={'1h':'20mg','12h':'40mg','24h':'80mg','72h':'160mg'};
const quantities=['Unique','Lot de 5','Lot de 10','Lot de 30'];
const storageKey='formulab:choices:v1';
const defaults={mental:false,power:'',emotion:'',admin:'',duration:'',quantity:'',step:'hero' as Step};
function readChoices(){
  try {
    const saved:unknown=JSON.parse(localStorage.getItem(storageKey)||'null');
    if(!saved || typeof saved!=='object' || Array.isArray(saved)) return defaults;
    const data={...saved} as Record<string,unknown>;
    // Preserve choices saved before the global label change.
    const aliases:Record<string,string>={'Vol':'Voler','Force décuplée':'Force musculaire','Super Cognition':'Super cognition','Maîtrise d’une langue':'Maîtrise instantanée d’une langue'};
    if(typeof data.power==='string') data.power=aliases[data.power]||data.power;
    const choice=(key:string,values:string[],fallback:string)=>typeof data[key]==='string' && (data[key]==='' || values.includes(data[key]))?data[key]:fallback;
    if(data.admin==='Comprimé') data.admin='Effervescent';
    const mental=typeof data.mental==='boolean'?data.mental:defaults.mental;
    return {
      mental,
      power:choice('power',(mental?mentalOptions:powerOptions).map(o=>o.name),defaults.power),
      emotion:choice('emotion',emotions,defaults.emotion),
      admin:choice('admin',admins,defaults.admin),
      duration:choice('duration',Object.keys(doses),defaults.duration),
      quantity:choice('quantity',quantities,defaults.quantity),
      step:(typeof data.step==='string' && ['hero',...destinations].includes(data.step)?data.step:defaults.step) as Step
    };
  } catch { return defaults; }
}
const codeFor=(value:string)=>value.slice(0,2);


// Additional option copy; the selected reference descriptions below come from Figma Page 2.
const optionDescriptions:Record<string,string>={
  'Zen':"Zen accompagne votre faculté d’un calme posé. Le geste prend son temps, l’attention reste disponible et les distractions passent au second plan. Une émotion pour imaginer votre pouvoir dans un état d’équilibre, sans précipitation.",
  'Énergisé':"Énergisé donne à votre faculté un élan vif et enthousiaste. L’envie d’agir vient au premier plan : commencer, essayer, avancer. Une émotion pour vivre votre pouvoir avec intensité et transformer l’impulsion en mouvement.",
  'Concentré':"Concentré rassemble l’attention autour d’un objectif. Le superflu s’efface, chaque geste devient plus intentionnel et le fil de l’action reste clair. Une émotion pour imaginer votre faculté avec précision et présence.",
  'Effervescent':"Le comprimé effervescent se dissout dans l’eau pour présenter votre formule sous forme de boisson. Votre pouvoir, votre émotion et la durée choisie restent identiques.",
  'En colère':"En colère accompagne votre faculté d’une détermination intense. La tension devient une impulsion pour agir : votre pouvoir garde ses limites, mais votre manière de le vivre devient plus affirmée.",
  'Patch':"Le patch fait de votre formule un élément que l’on porte sur soi. Une présentation discrète, pensée comme une autre manière d’accompagner votre pouvoir au fil de la durée sélectionnée.",
  'Suppositoire':"Le suppositoire propose une autre forme d’administration pour votre formule. Ce choix définit sa présentation ; votre faculté, votre émotion et la durée d’action restent celles que vous avez sélectionnées.",
  '12h':"Avec 40 mg, votre formule est configurée pour une durée de douze heures. Une fenêtre plus étendue qu’un besoin ponctuel, pour imaginer votre faculté sur une grande partie de la journée.",
  '24h':"Avec 80 mg, votre formule couvre une durée de vingt-quatre heures. Ce choix associe une journée complète à un dosage plus élevé, conformément à la progression de la gamme.",
  '72h':"Avec 160 mg, votre formule atteint la durée maximale proposée : soixante-douze heures. C’est le format le plus prolongé de la gamme, associé à sa concentration la plus élevée.",
  'Unique':"Une seule capXule, composée avec vos choix de pouvoir, d’émotion, d’administration et de durée. La quantité ne change pas le dosage de votre formule.",
  'Lot de 5':"Cinq capXules de la même composition. Chaque unité reprend vos choix de pouvoir, d’émotion, d’administration et de durée, sans modification du dosage.",
  'Lot de 10':"Dix capXules réunies dans un même lot. La composition choisie est identique pour chaque unité ; seule la quantité change.",
  'Lot de 30':"Trente capXules de votre formule personnalisée. Le lot le plus important proposé conserve exactement les mêmes choix et le même dosage par unité."
};

type Faculty={name:string;family:'physical'|'mental';icon:ComponentType<{size?:number}>;description:string;effects:string[];contraindications:string[];price:number;image?:string};
const commonContraindication='Grossesse et allaitement, conduite de véhicule, prise d’une autre formule dans les 24h';
// Source unique : contenus de référence fournis par l’utilisateur.
const faculties:Record<string,Faculty>={
  "Vitesse fulgurante":{name:"Vitesse fulgurante",family:"physical",icon:Zap,description:"Parcourir une distance en un instant, réagir avant que l’occasion ne disparaisse : la vitesse fulgurante transforme le rapport au mouvement. Une faculté physique pour celles et ceux qui imaginent toujours leur prochain geste avec un temps d’avance.",effects:["Sensation de lenteur"],contraindications:["Antécédents de troubles cardiaques",commonContraindication],price:80,image:vitesse},
  "Voler":{name:"Voler",family:"physical",icon:Wing,description:"Voler, ce n'est pas seulement s'élever, c'est gagner un axe entier de liberté, voir un lieu depuis un angle qu'aucun escalier ni aucune fenêtre ne permet, franchir un obstacle en l'ignorant plutôt qu'en le contournant.",effects:["Paralysie momentanée"],contraindications:["Vertige ou peur du vide",commonContraindication],price:120},
  "Force musculaire":{name:"Force musculaire",family:"physical",icon:BicepsFlexed,description:"Soulever, porter, pousser : la force décuplée donne une autre dimension aux gestes du corps. Dans votre formule, elle permet d’envisager les obstacles par la puissance plutôt que par le détour.",effects:["Courbatures", "Maladresse", "Appétit démesuré pour le fer"],contraindications:["Maladies neuromusculaires",commonContraindication],price:160},
  "Invisibilité":{name:"Invisibilité",family:"physical",icon:EyeOff,description:"Se soustraire aux regards et traverser un lieu sans attirer l’attention : l’invisibilité fait de la discrétion votre faculté. Elle change la manière d’occuper l’espace, en laissant le choix de se montrer ou de rester hors de vue.",effects:["Vision trouble"],contraindications:["Personnes sujettes au sentiment d’isolement",commonContraindication],price:140},
  "Super cognition":{name:"Super cognition",family:"mental",icon:Brain,description:"La super cognition, ce n’est pas simplement « être plus intelligent », c’est voir immédiatement les liens qu’il faudrait normalement chercher, traiter en une fraction de seconde ce qui prend d’ordinaire plusieurs détours de raisonnement, tenir plusieurs problèmes en tête sans en perdre le fil.",effects:["Migraine, lieu bruyant ou très fréquenté"],contraindications:["Troubles anxieux généralisés ou TOC",commonContraindication],price:100,image:cognitionCapsule},
  "Télépathie":{name:"Télépathie",family:"mental",icon:TelepathyIcon,description:"La télépathie imagine un échange qui se passe de mots : percevoir une pensée et transmettre une idée directement d’un esprit à l’autre. Une faculté mentale centrée sur le lien, la compréhension et ce qui reste habituellement inexprimé.",effects:["Les pensées des autres se mélangent aux siennes"],contraindications:["Anxiété sociale ou hypersensibilité émotionnelle",commonContraindication],price:120,image:telepathie},
  "Contrôle des rêves":{name:"Contrôle des rêves",family:"mental",icon:DreamIcon,description:"Reconnaître un rêve, en orienter le décor et en choisir la suite : cette faculté fait de l’imaginaire un espace à explorer consciemment. Vous composez votre propre récit au lieu de simplement le traverser.",effects:["Confusion entre rêves et réalité au réveil"],contraindications:["Antécédents de somnambulisme",commonContraindication],price:40},
  "Maîtrise instantanée d’une langue":{name:"Maîtrise instantanée d’une langue",family:"mental",icon:LanguageIcon,description:"Comprendre et se faire comprendre dans une autre langue, saisir ses nuances autant que ses mots : cette faculté ouvre une nouvelle façon d’échanger. L’esprit accède à un langage comme à un univers déjà familier.",effects:["Perte temporaire de sa langue maternelle"],contraindications:["Troubles du langage préexistants : aphasie, dyslexie sévère, bégaiement (la restructuration linguistique soudaine peut aggraver le trouble)",commonContraindication],price:0},
};
const powerOptions=Object.values(faculties).filter(f=>f.family==='physical');
const mentalOptions=Object.values(faculties).filter(f=>f.family==='mental');

// Base premium de 600 € par unité, compléments selon la composition.
const prices:Record<string,number>={'Confiant':20,'Zen':0,'Énergisé':60,'Concentré':40,'En colère':50,Patient:10,'Gélule':0,'Effervescent':20,'Patch':40,'Suppositoire':20,'1h':0,'12h':40,'24h':80,'72h':120};
const counts:Record<string,number>={'Unique':1,'Lot de 5':5,'Lot de 10':10,'Lot de 30':30};
const unitPrice=(choices:string[])=>600+choices.slice(0,4).reduce((sum,value)=>sum+(faculties[value]?.price??prices[value]??0),0);
const units=(mode:string,count:number)=>({Gélule:count===1?'gélule':'gélules',Effervescent:count===1?'comprimé':'comprimés',Patch:count===1?'patch':'patchs',Suppositoire:count===1?'suppositoire':'suppositoires'}[mode]||(count===1?'unité':'unités'));
const adminImages:Record<string,string>={'Effervescent':effervescent,'Patch':patch,'Suppositoire':suppositoire};
const adminIcons:Record<string,typeof Pill>={'Gélule':Pill,'Effervescent':Circle,'Patch':Bandage,'Suppositoire':Droplet};
const FamilyContext=createContext({mental:false,power:'',step:'hero' as Step,choices:[] as string[]});
function FacultyAccordions({faculty}:{faculty?:Faculty}){
  return <div className="faculty-accordions" key={faculty?.name||'empty'}>{[
    {label:'Effets secondaires',icon:Activity,items:faculty?.effects,empty:'Choisissez une faculté pour découvrir les effets secondaires associés.'},
    {label:'Contre-indications',icon:ShieldAlert,items:faculty?.contraindications,empty:'Les profils concernés seront signalés après sélection d’une faculté.'}
  ].map(({label,icon:Icon,items,empty})=><details className="faculty-accordion" name="faculty-information" key={label}><summary><span className="disclosure-label"><Icon size={15} aria-hidden="true"/>{label}</span><ChevronRight className="disclosure-chevron" size={16} aria-hidden="true"/></summary>{items?<><ul>{items.map(text=><li key={text}>{text}</li>)}{label==='Contre-indications' && <li>Déconseillé aux moins de 18 ans afin de ne pas impacter le développement de l’être humain. Non interdit aux mineurs, mais disponible à la vente uniquement aux personnes de 18 ans et plus.</li>}</ul>{label==='Effets secondaires' && <p>Ces effets apparaissent après la durée d’action sélectionnée, une fois l’effet du pouvoir terminé.</p>}</>:<p>{empty}</p>}</details>)}</div>;
}
function SafetyInfo(){
  const {power,step,choices}=useContext(FamilyContext);
  const index=destinations.indexOf(step);
  const chosen=choices.slice(0,Math.min(index+1,5)).filter(Boolean);
  const expected=Math.min(index+1,5);
  return <div className="safety-sections"><FacultyAccordions faculty={faculties[power]}/>{index>=1 && index<5 && <div className="compatibility" role="status"><strong>Compatibilité de la formule</strong><p>{chosen.length<expected?`Complétez les choix : ${chosen.length}/${expected} éléments sélectionnés.`:'Association disponible dans ce configurateur.'}</p>{chosen.length>0 && <p>{chosen.join(' · ')}</p>}<small>Compatibilité narrative, sans validation médicale.</small></div>}</div>;
}
function FacultyCard({power,onNext}:{power:string,onNext:()=>void}){
  const faculty=faculties[power];const Icon=faculty?.icon;
  return <div className="detail-card faculty-card"><div className="detail-top"><div className="eyebrow">{faculty?'FACULTÉ SÉLECTIONNÉE':'CHOIX ACTIF'}</div><div className="title-code"><h2>{faculty?.name||'Sélectionnez un pouvoir'}</h2>{Icon && <Icon size={25}/>}</div><p>{faculty?.description||'Choisissez un pouvoir pour découvrir son effet.'}</p></div><div className="detail-bottom"><FacultyAccordions faculty={faculty}/><div className="actions"><button className="primary next" onClick={onNext}>Continuer vers Émotion <ArrowRight size={16}/></button></div></div></div>;
}

function App(){
  const [saved]=useState(readChoices);
  const [step,setStep]=useState<Step>(()=>{
    const node=new URLSearchParams(location.search).get('node')?.replace(':','-')||'';
    return screenByNode[node]||saved.step;
  });
  const [mental,setMental]=useState(saved.mental);
  const [power,setPower]=useState(saved.power);
  const [emotion,setEmotion]=useState(saved.emotion);
  const [admin,setAdmin]=useState(saved.admin);
  const [duration,setDuration]=useState(saved.duration);
  const [quantity,setQuantity]=useState(saved.quantity);
  const changeFamily=(value:boolean)=>{
    setMental(value);
    if(!(value?mentalOptions:powerOptions).some(o=>o.name===power)) setPower('');
  };
  useEffect(()=>{
    try { localStorage.setItem(storageKey,JSON.stringify({mental,power,emotion,admin,duration,quantity,step})); }
    catch { /* Storage can be unavailable; React state remains usable. */ }
  },[mental,power,emotion,admin,duration,quantity,step]);

  const stepIndex=useMemo(()=>({power:0,emotion:1,admin:2,duration:3,quantity:4,recap:5,hero:-1}[step]),[step]);
  const go=(s:Step)=>setStep(s);
  const enter=(family:boolean)=>{
    const update=()=>flushSync(()=>{changeFamily(family);setStep('power')});
    if(document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches){
      const transition=document.startViewTransition(update);
      void transition.finished.catch(()=>{});
    } else update();
  };
  if(step==='hero') return <Hero onPhysical={()=>enter(false)} onMental={()=>enter(true)}/>;

  return <FamilyContext.Provider value={{mental,power,step,choices:[power,emotion,admin,duration,quantity]}}><div className="app-shell" data-emotion={emotion} data-power={power} data-step={step}>
    <Header onHome={()=>go('hero')}/>
    <StepBar active={stepIndex} onStepChange={go}/>
    {step==='power' && <PowerScreen mental={mental} setMental={changeFamily} power={power} setPower={(value)=>setPower(current=>current===value?'':value)} onNext={()=>go('emotion')}/>}
    {step==='emotion' && <ChoiceScreen kind="emotion" title="Émotion" description="L'émotion conditionne la faculté. Choisir une émotion, c'est décider non pas de ce que la formule permet de faire, mais de l'état dans lequel on le fait. Une même capacité vécue dans le calme ou dans l'euphorie ne produit pas le même geste ni le même résultat." options={emotions} selected={emotion} setSelected={(value)=>setEmotion(current=>current===value?'':value)} cardTitle="ÉMOTION SÉLECTIONNÉE" cardName="Confiant" cardCode="Co" cardText="Confiant apporte une assurance calme à votre faculté. Vous gardez la conscience des obstacles, mais abordez chaque geste avec moins d’hésitation. Cette émotion change votre manière d’agir, pas les limites du pouvoir choisi." onBack={()=>go('power')} onNext={()=>go('admin')}/>}
    {step==='admin' && <ChoiceScreen kind="admin" title="Mode d’administration" description="Le mode d'administration décide comment la formule entre en jeu et à quel rythme. Un même effet peut arriver instantanément ou en trois quarts d'heure, se remarquer ou passer totalement inaperçu. A-t-on besoin que ça agisse tout de suite, ou que ça s'installe sans que personne ne s'en aperçoive ?" options={admins} selected={admin} setSelected={(value)=>setAdmin(current=>current===value?'':value)} cardTitle="MODE D’ADMINISTRATION SÉLECTIONNÉ" cardName="Gélule" cardCode="Ge" cardText="La gélule est la présentation en capsule de votre formule. Chaque unité contient la même composition et correspond à la durée choisie. Le format ne change ni votre pouvoir ni votre émotion ; il détermine la forme de chaque unité commandée." onBack={()=>go('emotion')} onNext={()=>go('duration')}/>}
    {step==='duration' && <DurationScreen duration={duration} setDuration={(value)=>setDuration(current=>current===value?'':value)} onBack={()=>go('admin')} onNext={()=>go('quantity')}/>}
    {step==='quantity' && <QuantityScreen quantity={quantity} setQuantity={(value)=>setQuantity(current=>current===value?'':value)} onBack={()=>go('duration')} onNext={()=>go('recap')}/>}
    {step==='recap' && <Recap onBack={()=>go('quantity')} power={power} emotion={emotion} admin={admin} duration={duration} quantity={quantity}/>}
  </div></FamilyContext.Provider>
}

function Header({onHome}:{onHome:()=>void}){return <header className="header"><button type="button" className="logo" onClick={onHome} aria-label="FormuLab — revenir à l’accueil">FormuLab</button><span className="tagline">Créer son superpouvoir</span></header>}
function StepBar({active,onStepChange}:{active:number,onStepChange:(step:Step)=>void}){
  return <nav className="steps" aria-label="Progression de votre formule">{steps.map((label,i)=><button key={label} type="button" className={'step'+(i===active?' active':'')} onClick={()=>onStepChange(destinations[i])} aria-current={i===active?'step':undefined}><span className="step-number" aria-hidden="true">{i+1}</span><span className="step-label">{label}</span></button>)}</nav>;
}
function Capsule({hero=false,glow=false}:{hero?:boolean,glow?:boolean}){
  const {power,step,choices}=useContext(FamilyContext);
  const faculty=faculties[power];
  const legacyPresentation=(step==='recap'||step==='admin') && Boolean(adminImages[choices[2]]);
  const isCognition=faculty?.image===cognitionCapsule;
  const isTelepathie=faculty?.image===telepathie;
  const isVitesse=faculty?.image===vitesse;
  const cognitionFill:Record<string,string>={'1h':`${import.meta.env.BASE_URL}assets/cognition-quarter.png`,'12h':cognition12,'24h':cognition24,'72h':cognitionCapsule};
  const isCognitionWide=isCognition && (choices[3]==='12h'||choices[3]==='24h');
  const source=legacyPresentation?adminImages[choices[2]]:isCognition?(cognitionFill[choices[3]]||cognitionCapsule):faculty?.image||capsule;
  return <div className={'capsule-wrap'+(hero?' hero':'')+(glow && Boolean(choices[1])?' has-glow':'')}><img src={source} className={'capsule'+(legacyPresentation?' administration-image':'')+(isCognition?(isCognitionWide?' cognition-wide-image':' cognition-image'):'')+(isTelepathie?' telepathie-image':'')+(isVitesse?' vitesse-image':'')} style={legacyPresentation?{aspectRatio:choices[2]==='Suppositoire'?'3 / 2':'6 / 5',objectFit:'contain'}:undefined} alt={faculty?`Pilule — ${faculty.name}`:'Pilule FormuLab'}/></div>;
}
function Hero({onPhysical,onMental}:{onPhysical:()=>void,onMental:()=>void}){return <div className="hero-screen"><div className="hero-content"><Capsule hero/><h1>Dépassez le commun<br/>des mortels.</h1><p>Composez votre capXule à votre mesure : choisissez d’abord la famille de pouvoir, puis ajustez son émotion, sa durée et son mode d’administration pour constituer la molécule de votre capXule.</p><div className="hero-actions"><button className="primary" onClick={onMental}>Pouvoirs mentaux</button><button className="primary" onClick={onPhysical}>Pouvoirs physiques</button></div></div></div>}
function PowerScreen({mental,setMental,power,setPower,onNext}:{mental:boolean,setMental:(v:boolean)=>void,power:string,setPower:(v:string)=>void,onNext:()=>void}){
  const title=mental?'Faculté mentale':'Faculté physique';
  const description=mental?"Les facultés mentales n'ajoutent rien au corps. Elles changent ce que l'esprit peut percevoir, comprendre ou atteindre. Leur effet est profond, elles modifient le rapport à soi, aux autres ou à l'information plutôt que le rapport à l'espace.":"Les facultés physiques agissent directement sur le corps : ce qu'il peut porter, à quelle vitesse il se déplace, jusqu'où il peut aller ou à quel point il peut rester hors de vue. Elles se ressentent tout de suite, dans le geste, avant même de se penser.";
  const options=mental?mentalOptions:powerOptions;
  return <main><section className="intro"><h1>{title}</h1><p>{description}</p>{<div className={"switchline"+(mental?" mental":" physical")}><span className={!mental?"family-active":""}><Dumbbell size={15} aria-hidden="true"/>Faculté physique</span><button role="switch" aria-checked={mental} aria-label="Faculté mentale" onClick={()=>setMental(!mental)} className={'switch '+(mental?'on':'')}><span/></button><span className={mental?"family-active":""}><Brain size={15} aria-hidden="true"/>Faculté mentale</span></div>}</section>
  <section className="workspace"><div className="left-stage"><Capsule/><div className="choice-row">{options.map(({name,icon:Icon})=><button key={name} className={'choice-card'+(power===name?' selected':'')} aria-pressed={power===name} onClick={()=>setPower(name)}><Icon size={24}/><span>{name}</span></button>)}</div></div><FacultyCard power={power} onNext={onNext}/></section></main>
}
function ChoiceScreen({kind,title,description,options,selected,setSelected,cardTitle,cardName,cardCode,cardText,onBack,onNext}:{kind:string,title:string,description:string,options:string[],selected:string,setSelected:(v:string)=>void,cardTitle:string,cardName:string,cardCode:string,cardText:string,onBack:()=>void,onNext:()=>void}){const {choices}=useContext(FamilyContext);return <main><section className="intro"><h1>{title}</h1><p>{description}</p></section><section className="workspace"><div className="left-stage"><Capsule glow/><div className={'choice-row'+(kind==='emotion'?' emotion-choices':'')}>{options.map((name)=>{const Icon=kind==='admin'?adminIcons[name]:emotionIcons[name];return <button key={name} className={'choice-card'+(selected===name?' selected':'')} aria-pressed={selected===name} onClick={()=>setSelected(name)}><Icon size={24}/><span>{name}</span></button>})}</div></div><div className="detail-card compact"><div className="detail-top"><div className="eyebrow">{selected?cardTitle:'CHOIX ACTIF'}</div><div className="title-code">{kind==='admin' && selected && <img className="admin-preview" src={adminImages[selected]||capsule} alt={`Présentation ${selected}`}/>}<h2>{selected||(kind==='admin'?'Sélectionnez un mode':'Sélectionnez une émotion')}</h2>{selected && <span>{selected===cardName?cardCode:codeFor(selected)}</span>}</div><p>{!selected?(kind==='admin'?'Choisissez un mode d’administration pour découvrir sa présentation.':'Choisissez une émotion pour découvrir comment elle accompagne votre faculté.'):selected===cardName?cardText:optionDescriptions[selected]}</p>{selected && choices[0] && <p className="composition-note">{kind==='emotion'?`${selected} accompagne votre faculté ${choices[0]}.`:`Votre formule ${choices[0]}${choices[1]?` · ${choices[1]}`:''} est présentée en ${selected.toLowerCase()}.`}</p>}</div><div className="detail-bottom"><SafetyInfo/><div className="actions"><button className="secondary" onClick={onBack}><ArrowLeft size={16}/>Précédent</button><button className="primary next" onClick={onNext}>Continuer<ArrowRight size={16}/></button></div></div></div></section></main>}
function DurationScreen({duration,setDuration,onBack,onNext}:{duration:string,setDuration:(v:string)=>void,onBack:()=>void,onNext:()=>void}){const opts=Object.keys(doses);return <main><section className="intro"><h1>Durée d’action</h1><p>La durée d'action détermine le dosage : plus l'effet doit durer longtemps, plus la concentration en principe actif doit être importante. Un effet court se contente d'une dose légère et un effet long demande une dose plus forte. Le choix de la durée engage directement l'intensité du dosage à prendre.</p></section><section className="workspace"><div className="left-stage duration"><Capsule glow/><div className="choice-row">{opts.map(o=><button className={'choice-card'+(o===duration?' selected':'')} aria-pressed={o===duration} onClick={()=>setDuration(o)} key={o}>{o}</button>)}</div></div><div className="detail-card compact"><div className="detail-top"><div className="eyebrow">{duration?'DURÉE D’ACTION CHOISIE':'CHOIX ACTIF'}</div><div className="title-code"><h2>{duration||'Sélectionnez une durée'} {duration && <em>({doses[duration]})</em>}</h2></div><p>{!duration?'Choisissez une durée pour découvrir le dosage associé et la période d’action de votre formule.':duration==='1h'?"Une heure correspond à 20 mg dans ce configurateur. Cette fenêtre courte est pensée pour une action ponctuelle. À son terme, la faculté revient à son état initial ; choisir plusieurs unités ne prolonge pas la durée de chacune.":optionDescriptions[duration]}</p></div><div className="detail-bottom"><SafetyInfo/><div className="actions"><button className="secondary" onClick={onBack}><ArrowLeft size={16}/>Précédent</button><button className="primary next" onClick={onNext}>Continuer<ArrowRight size={16}/></button></div></div></div></section></main>}
function QuantityScreen({quantity,setQuantity,onBack,onNext}:{quantity:string,setQuantity:(v:string)=>void,onBack:()=>void,onNext:()=>void}){const opts=quantities;const {choices}=useContext(FamilyContext);const price=unitPrice(choices);const complete=choices.slice(0,4).every(Boolean);const mode=choices[2];return <main><section className="intro"><h1>Quantité</h1><p>Choisissez la quantité souhaitée et adaptée à votre besoin. Celle-ci n’influe pas sur le dosage.</p></section><section className="workspace"><div className="left-stage"><Capsule glow/><div className="choice-row">{opts.map(o=><button className={'choice-card'+(quantity===o?' selected':'')} aria-pressed={quantity===o} onClick={()=>setQuantity(o)} key={o}><span>{counts[o]} {units(mode,counts[o])}</span><small>{complete?`${price*counts[o]} €`:'À compléter'}</small></button>)}</div></div><div className="detail-card compact"><div className="detail-top"><div className="eyebrow">{quantity?'QUANTITÉ CHOISIE':'CHOIX ACTIF'}</div><div className="title-code"><h2>{quantity||'Sélectionnez une quantité'}</h2></div><p>{quantity?`${counts[quantity]} ${units(mode,counts[quantity])} de même composition${choices[0]?` : ${choices[0]}`:''}${choices[1]?` · ${choices[1]}`:''}${choices[3]?` · ${choices[3]} (${doses[choices[3]]}) par unité`:''}. La quantité ne change pas le dosage unitaire.`:'Choisissez une quantité pour composer votre lot. Le dosage reste identique pour chaque unité.'}</p>{quantity && complete && <p className="quantity-price">{price} € par {units(mode,1)} × {counts[quantity]} = <strong>{price*counts[quantity]} €</strong></p>}</div><div className="detail-bottom"><SafetyInfo/><div className="actions"><button className="secondary" onClick={onBack}><ArrowLeft size={16}/>Précédent</button><button className="primary next" onClick={onNext}>Passer au récapitulatif<ArrowRight size={16}/></button></div></div></div></section></main>}
function Recap({power,emotion,admin,duration,quantity,onBack}:{onBack:()=>void,power:string,emotion:string,admin:string,duration:string,quantity:string}){const selectedCount=[power,emotion,admin,duration,quantity].filter(Boolean).length;return <main className="recap"><section className="intro"><h1>Récapitulatif</h1><p>{selectedCount===5?'Votre formule est prête. Retrouvez ci-dessous l’ensemble de vos choix.':selectedCount===0?'Votre formule attend vos premiers choix. Parcourez les étapes pour la composer.':`Votre formule est encore à compléter : ${selectedCount}/5 choix renseignés.`}</p></section><section className="workspace recap-card"><div className="left-stage recap-visual"><Capsule glow/><div className="formula-elements">{[
  {label:'Pouvoir',value:power,symbol:codeFor(power),text:'La faculté de votre formule.'},
  {label:'Émotion',value:emotion,symbol:codeFor(emotion),text:'L’état d’esprit qui accompagne le pouvoir.'},
  {label:'Administration',value:admin,symbol:codeFor(admin),text:'La forme choisie pour votre formule.'},
  {label:'Durée',value:duration,symbol:duration,text:duration?`Une action de ${duration}, dosée à ${doses[duration]}.`:'Choisissez une durée et son dosage.'}
].map((item,i)=><div className="formula-element" key={item.label}><div className="element-tile"><span className="element-number">0{i+1} · {item.label}</span><strong>{item.symbol||'—'}</strong><span>{item.value||'À choisir'}</span></div><p>{item.text}</p></div>)}</div></div><div className="detail-card recap-data"><div className="recap-summary"><div className="recap-heading"><div className="eyebrow">COMMANDE</div><h2>{selectedCount?'Votre capXule unique':'Composez votre capXule'}</h2>{selectedCount===0 && <p>Vos éléments et leur prix apparaîtront ici après sélection.</p>}</div><dl className="recap-list">{[['Votre pouvoir',power],['Votre émotion',emotion],['Votre mode d’administration',admin]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value||'À choisir'}</dd></div>)}<div className="recap-pair"><div><dt>Durée d’action</dt><dd>{duration?`${duration} (${doses[duration]})`:'À choisir'}</dd></div><div><dt>Quantité</dt><dd>{quantity?`${counts[quantity]} ${units(admin,counts[quantity])}`:'À choisir'}</dd></div></div></dl></div><div className="recap-checkout"><div className="price"><span>{selectedCount===5?`${unitPrice([power,emotion,admin,duration])} € × ${counts[quantity]} ${units(admin,counts[quantity])}`:'Complétez votre formule'}</span><strong>{selectedCount===5?`${unitPrice([power,emotion,admin,duration])*counts[quantity]} €`:'—'}</strong></div><div className="actions"><button className="secondary" onClick={onBack}><ArrowLeft size={16}/>Précédent</button><button className="primary pay">Passer au paiement <ChevronRight size={16}/></button></div></div></div></section></main>}
export default App;
