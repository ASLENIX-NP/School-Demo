import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import {motion,AnimatePresence} from "motion/react";
import api from "../lib/api";
import AdmissionsPage,{defaultSettings,mergeAdmissionsContent} from "../app/components/Admissions";
import {ArrowLeft,Eye,Settings,Users,BarChart3,Pencil,Trash2,Plus,Save,X,CheckCircle,AlertCircle,Search,Download,TrendingUp} from "lucide-react";

/*
 ADMIN ADMISSIONS
 - Live Preview is the visual editor.
 - Pencil buttons are rendered by AdmissionsPage.
 - Every save writes the complete admission settings to
   PUT /api/admissions/settings.
 - Public Admissions reads the same endpoint.
*/

const id=(p)=>`${p}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;

function Field({label,value,onChange,area=false,type="text"}){
  return <label className="block"><span className="mb-1 block text-xs font-bold text-slate-600">{label}</span>
    {area?<textarea rows={5} value={value||""} onChange={e=>onChange(e.target.value)} className="w-full rounded-xl border p-3 text-sm outline-none focus:border-amber-500"/>:
    <input type={type} value={value||""} onChange={e=>onChange(e.target.value)} className="w-full rounded-xl border p-3 text-sm outline-none focus:border-amber-500"/>}
  </label>;
}

function Modal({target,settings,onClose,onSave,saving}){
  const [f,setF]=useState({});
  useEffect(()=>{
    if(!target)return;
    const s=settings;
    const map={
      hero:{heroBadgeText:s.heroBadgeText,heroTitle:s.heroTitle,heroDescription:s.heroDescription,applyButtonText:s.applyButtonText,academicSession:s.academicSession,startDate:s.startDate,endDate:s.endDate},
      status:{isOpen:s.isOpen,academicSession:s.academicSession,startDate:s.startDate,endDate:s.endDate},
      whyUsHeader:{whyUsBadge:s.whyUsBadge,whyUsTitle:s.whyUsTitle,whyUsDescription:s.whyUsDescription},
      processHeader:{processBadge:s.processBadge,processTitle:s.processTitle,processDescription:s.processDescription},
      eligibilityHeader:{eligibilityBadge:s.eligibilityBadge,eligibilityTitle:s.eligibilityTitle,eligibilityDescription:s.eligibilityDescription},
      fees:{feeBadge:s.feeBadge,feeTitle:s.feeTitle,feeDescription:s.feeDescription,feeButtonText:s.feeButtonText,feeRequestButtonText:s.feeRequestButtonText},
      faqHeader:{faqsBadge:s.faqsBadge,faqsTitle:s.faqsTitle,faqsDescription:s.faqsDescription},
      contact:{contactBadge:s.contactBadge,contactTitle:s.contactTitle,contactDescription:s.contactDescription,contactPhone:s.contactPhone,contactEmail:s.contactEmail,contactHours:s.contactHours,contactAddress:s.contactAddress,ctaTitle:s.ctaTitle,ctaDescription:s.ctaDescription,ctaButtonText:s.ctaButtonText,ctaClosedButtonText:s.ctaClosedButtonText}
    };
    if(map[target.type])setF(map[target.type]);
    else if(target.type==="whyUsCard")setF({...s.whyUs?.[target.index]});
    else if(target.type==="processStep")setF({...s.timelineSteps?.[target.index]});
    else if(target.type==="eligibilityCard")setF({...s.eligibilityCriteria?.[target.index]});
    else if(target.type==="faqItem")setF({...s.faqs?.[target.index]});
  },[target,settings]);
  if(!target)return null;
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const title=({hero:"Edit Hero",status:"Edit Admission Status",whyUsHeader:"Edit Why Red Rose",whyUsCard:"Edit Benefit Card",processHeader:"Edit Process",processStep:"Edit Process Step",eligibilityHeader:"Edit Eligibility",eligibilityCard:"Edit Eligibility Card",fees:"Edit Fees",faqHeader:"Edit FAQ Heading",faqItem:"Edit FAQ",contact:"Edit Contact & CTA"})[target.type]||"Edit";
  const save=()=>onSave(target,f);
  return <AnimatePresence><motion.div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" initial={{opacity:0}} animate={{opacity:1}} onMouseDown={onClose}>
    <motion.div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl" initial={{y:20,scale:.96,opacity:0}} animate={{y:0,scale:1,opacity:1}} onMouseDown={e=>e.stopPropagation()}>
      <div className="h-1 bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400"/>
      <div className="flex justify-between border-b p-5"><div><h2 className="text-xl font-black">{title}</h2><p className="text-xs text-slate-500">Save this selected item to the public Admissions page.</p></div><button onClick={onClose} className="rounded-xl bg-slate-100 p-2"><X size={18}/></button></div>
      <div className="space-y-4 p-5">
        {target.type==="hero"&&<><Field label="Badge" value={f.heroBadgeText} onChange={v=>set("heroBadgeText",v)}/><Field label="Title" value={f.heroTitle} onChange={v=>set("heroTitle",v)}/><Field label="Description" value={f.heroDescription} onChange={v=>set("heroDescription",v)} area/><div className="grid sm:grid-cols-2 gap-3"><Field label="Session" value={f.academicSession} onChange={v=>set("academicSession",v)}/><Field label="Apply Button" value={f.applyButtonText} onChange={v=>set("applyButtonText",v)}/><Field label="Start Date" type="date" value={f.startDate} onChange={v=>set("startDate",v)}/><Field label="End Date" type="date" value={f.endDate} onChange={v=>set("endDate",v)}/></div></>}
        {target.type==="status"&&<><button type="button" onClick={()=>set("isOpen",!f.isOpen)} className={`w-full rounded-2xl border p-4 text-left font-black ${f.isOpen?"bg-emerald-50 text-emerald-700":"bg-rose-50 text-rose-700"}`}>Applications are {f.isOpen?"OPEN":"CLOSED"}</button><div className="grid sm:grid-cols-2 gap-3"><Field label="Session" value={f.academicSession} onChange={v=>set("academicSession",v)}/><Field label="Start" type="date" value={f.startDate} onChange={v=>set("startDate",v)}/><Field label="End" type="date" value={f.endDate} onChange={v=>set("endDate",v)}/></div></>}
        {["whyUsHeader","processHeader","eligibilityHeader","faqHeader"].includes(target.type)&&<><Field label="Badge" value={f[target.type==="whyUsHeader"?"whyUsBadge":target.type==="processHeader"?"processBadge":target.type==="eligibilityHeader"?"eligibilityBadge":"faqsBadge"]} onChange={v=>set(target.type==="whyUsHeader"?"whyUsBadge":target.type==="processHeader"?"processBadge":target.type==="eligibilityHeader"?"eligibilityBadge":"faqsBadge",v)}/><Field label="Title" value={f[target.type==="whyUsHeader"?"whyUsTitle":target.type==="processHeader"?"processTitle":target.type==="eligibilityHeader"?"eligibilityTitle":"faqsTitle"]} onChange={v=>set(target.type==="whyUsHeader"?"whyUsTitle":target.type==="processHeader"?"processTitle":target.type==="eligibilityHeader"?"eligibilityTitle":"faqsTitle",v)}/><Field label="Description" value={f[target.type==="whyUsHeader"?"whyUsDescription":target.type==="processHeader"?"processDescription":target.type==="eligibilityHeader"?"eligibilityDescription":"faqsDescription"]} onChange={v=>set(target.type==="whyUsHeader"?"whyUsDescription":target.type==="processHeader"?"processDescription":target.type==="eligibilityHeader"?"eligibilityDescription":"faqsDescription",v)} area/></>}
        {target.type==="whyUsCard"&&<><Field label="Icon Name" value={f.icon} onChange={v=>set("icon",v)}/><Field label="Title" value={f.title} onChange={v=>set("title",v)}/><Field label="Description" value={f.desc} onChange={v=>set("desc",v)} area/></>}
        {target.type==="processStep"&&<><div className="grid sm:grid-cols-3 gap-3"><Field label="Number" value={f.number} onChange={v=>set("number",v)}/><div className="sm:col-span-2"><Field label="Title" value={f.title} onChange={v=>set("title",v)}/></div></div><Field label="Description" value={f.desc} onChange={v=>set("desc",v)} area/></>}
        {target.type==="eligibilityCard"&&<><Field label="Grade / Level" value={f.grade} onChange={v=>set("grade",v)}/><Field label="Age" value={f.age} onChange={v=>set("age",v)}/><Field label="Requirements" value={f.requirements} onChange={v=>set("requirements",v)} area/></>}
        {target.type==="fees"&&<><Field label="Badge" value={f.feeBadge} onChange={v=>set("feeBadge",v)}/><Field label="Title" value={f.feeTitle} onChange={v=>set("feeTitle",v)}/><Field label="Description" value={f.feeDescription} onChange={v=>set("feeDescription",v)} area/><Field label="Download Button" value={f.feeButtonText} onChange={v=>set("feeButtonText",v)}/><Field label="Office Button" value={f.feeRequestButtonText} onChange={v=>set("feeRequestButtonText",v)}/></>}
        {target.type==="faqItem"&&<><Field label="Question" value={f.question} onChange={v=>set("question",v)}/><Field label="Answer" value={f.answer} onChange={v=>set("answer",v)} area/></>}
        {target.type==="contact"&&<><div className="grid sm:grid-cols-2 gap-3"><Field label="Badge" value={f.contactBadge} onChange={v=>set("contactBadge",v)}/><Field label="Title" value={f.contactTitle} onChange={v=>set("contactTitle",v)}/><Field label="Phone" value={f.contactPhone} onChange={v=>set("contactPhone",v)}/><Field label="Email" value={f.contactEmail} onChange={v=>set("contactEmail",v)}/><Field label="Hours" value={f.contactHours} onChange={v=>set("contactHours",v)}/><Field label="Address" value={f.contactAddress} onChange={v=>set("contactAddress",v)}/></div><Field label="Description" value={f.contactDescription} onChange={v=>set("contactDescription",v)} area/><Field label="CTA Title" value={f.ctaTitle} onChange={v=>set("ctaTitle",v)}/><Field label="CTA Description" value={f.ctaDescription} onChange={v=>set("ctaDescription",v)} area/></>}
      </div>
      <div className="flex justify-end gap-2 border-t bg-slate-50 p-5"><button onClick={onClose} className="rounded-xl border bg-white px-5 py-2.5 text-sm font-bold">Cancel</button><button disabled={saving} onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 px-5 py-2.5 text-sm font-black"><Save size={15}/>{saving?"Saving...":"Save This Item"}</button></div>
    </motion.div>
  </motion.div></AnimatePresence>;
}

export default function AdminAdmissions(){
  const navigate=useNavigate();
  const [tab,setTab]=useState("preview");
  const [settings,setSettings]=useState(defaultSettings);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [target,setTarget]=useState(null);
  const [toast,setToast]=useState(null);
  const [inquiries,setInquiries]=useState([]);
  const [analytics,setAnalytics]=useState({});
  const [search,setSearch]=useState("");
  const [status,setStatus]=useState("All");

  const message=(type,text)=>{setToast({type,text});setTimeout(()=>setToast(null),3500)};

  const load=async()=>{
    setLoading(true);
    try{
      const [s,i,a]=await Promise.all([api.get("/api/admissions/settings"),api.get("/api/admissions/inquiries"),api.get("/api/admissions/analytics")]);
      setSettings(mergeAdmissionsContent(s.data?.data||{}));
      setInquiries(i.data?.data||[]);
      setAnalytics(a.data?.data||{});
    }catch(e){message("error","Failed to load admission data.");}
    finally{setLoading(false);}
  };
  useEffect(()=>{load()},[]);

  const save=async(next,text="Admission page updated. Saved to website. ")=>{
    setSaving(true);
    try{
      const r=await api.put("/api/admissions/settings",mergeAdmissionsContent(next));
      if(r.data?.success===false)throw new Error(r.data.message);
      const saved=mergeAdmissionsContent(r.data?.data||next);
      setSettings(saved);
      window.dispatchEvent(new CustomEvent("rr-admissions-updated",{detail:saved}));
      message("success",text);
      return saved;
    }catch(e){message("error",e.response?.data?.message||e.message||"Save failed.");return null}
    finally{setSaving(false)}
  };

  const edit=async(t,f)=>{
    let n={...settings};
    const scalar={
      hero:["heroBadgeText","heroTitle","heroDescription","applyButtonText","academicSession","startDate","endDate"],
      status:["isOpen","academicSession","startDate","endDate"],
      whyUsHeader:["whyUsBadge","whyUsTitle","whyUsDescription"],
      processHeader:["processBadge","processTitle","processDescription"],
      eligibilityHeader:["eligibilityBadge","eligibilityTitle","eligibilityDescription"],
      fees:["feeBadge","feeTitle","feeDescription","feeButtonText","feeRequestButtonText"],
      faqHeader:["faqsBadge","faqsTitle","faqsDescription"],
      contact:["contactBadge","contactTitle","contactDescription","contactPhone","contactEmail","contactHours","contactAddress","ctaTitle","ctaDescription","ctaButtonText","ctaClosedButtonText"]
    };
    if(scalar[t.type])scalar[t.type].forEach(k=>n[k]=f[k]);
    if(t.type==="whyUsCard"){const x=[...(n.whyUs||[])];x[t.index]={...(x[t.index]||{}),...f,id:x[t.index]?.id||id("why")};n.whyUs=x}
    if(t.type==="processStep"){const x=[...(n.timelineSteps||[])];x[t.index]={...(x[t.index]||{}),...f,id:x[t.index]?.id||id("step")};n.timelineSteps=x}
    if(t.type==="eligibilityCard"){const x=[...(n.eligibilityCriteria||[])];x[t.index]={...(x[t.index]||{}),...f,id:x[t.index]?.id||id("elig")};n.eligibilityCriteria=x}
    if(t.type==="faqItem"){const x=[...(n.faqs||[])];x[t.index]={...(x[t.index]||{}),...f,id:x[t.index]?.id||id("faq")};n.faqs=x}
    if(await save(n)){setTarget(null)}
  };

  const add=async(t)=>{
    const n={...settings};
    if(t.type==="whyUs")n.whyUs=[...(n.whyUs||[]),{id:id("why"),icon:"Sparkles",title:"New Benefit",desc:"Add your description."}];
    if(t.type==="process")n.timelineSteps=[...(n.timelineSteps||[]),{id:id("step"),number:String((n.timelineSteps||[]).length+1).padStart(2,"0"),title:"New Step",desc:"Add your step description."}];
    if(t.type==="eligibility")n.eligibilityCriteria=[...(n.eligibilityCriteria||[]),{id:id("elig"),grade:"New Class",age:"Age",requirements:"Add requirements."}];
    if(t.type==="faq")n.faqs=[...(n.faqs||[]),{id:id("faq"),question:"New question?",answer:"Add answer."}];
    const s=await save(n,"New item added.");
    if(!s)return;
    if(t.type==="whyUs")setTarget({type:"whyUsCard",index:s.whyUs.length-1});
    if(t.type==="process")setTarget({type:"processStep",index:s.timelineSteps.length-1});
    if(t.type==="eligibility")setTarget({type:"eligibilityCard",index:s.eligibilityCriteria.length-1});
    if(t.type==="faq")setTarget({type:"faqItem",index:s.faqs.length-1});
  };

  const remove=async(t)=>{
    if(!confirm("Delete this item?"))return;
    const n={...settings};
    if(t.type==="whyUsCard")n.whyUs=(n.whyUs||[]).filter((_,i)=>i!==t.index);
    if(t.type==="processStep")n.timelineSteps=(n.timelineSteps||[]).filter((_,i)=>i!==t.index);
    if(t.type==="eligibilityCard")n.eligibilityCriteria=(n.eligibilityCriteria||[]).filter((_,i)=>i!==t.index);
    if(t.type==="faqItem")n.faqs=(n.faqs||[]).filter((_,i)=>i!==t.index);
    await save(n,"Item deleted.");
  };

  const filtered=inquiries.filter(x=>{
    const q=search.toLowerCase();
    return (!q||`${x.studentName} ${x.parentName} ${x.email} ${x.applyingClass}`.toLowerCase().includes(q))&&(status==="All"||x.status===status)
  });

  if(loading)return <div className="min-h-screen flex items-center justify-center bg-slate-100"><div className="rounded-2xl bg-white px-6 py-4 font-bold shadow">Loading Admission Control Panel...</div></div>;

  return <div className="min-h-screen bg-slate-100 text-slate-900">
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3"><button onClick={()=>navigate("/admin/dashboard")} className="rounded-xl border bg-slate-50 px-3 py-2 text-xs font-bold"><ArrowLeft size={14} className="inline mr-1"/>Dashboard</button><div><b className="text-sm">Admissions Manager</b><p className="text-[10px] text-slate-500">Live visual editor — saved changes use the public page API.</p></div></div>
        <div className="flex rounded-xl bg-slate-100 p-1">{[["preview","Live Preview",Eye],["editor","Page Editor",Settings],["inquiries","Inquiries Desk",Users],["analytics","Analytics",BarChart3]].map(([k,l,I])=><button key={k} onClick={()=>setTab(k)} className={`rounded-lg px-3 py-2 text-[11px] font-black ${tab===k?"bg-amber-400":"text-slate-600"}`}><I size={13} className="inline mr-1"/>{l}</button>)}</div>
      </div>
    </header>
    {toast&&<div className="fixed right-5 top-20 z-[9999] rounded-2xl border bg-white px-4 py-3 text-sm font-bold shadow-xl">{toast.type==="success"?<CheckCircle className="inline mr-2 text-emerald-600"/>:<AlertCircle className="inline mr-2 text-rose-600"/>}{toast.text}</div>}
    <main className="mx-auto max-w-[1500px] p-4 sm:p-6">
      {tab==="preview"&&<div className="space-y-4"><div className="rounded-3xl border bg-white p-5 shadow-sm"><b>Live Preview with Editing</b><p className="mt-1 text-xs text-slate-500">Click the pencil on any section. Saving immediately updates the database and public Admissions page.</p></div><div className="overflow-hidden rounded-[28px] border bg-white shadow-2xl"><AdmissionsPage editMode contentOverride={settings} onEditTarget={setTarget} onDeleteTarget={remove} onAddTarget={add}/></div></div>}
      {tab==="editor"&&<div className="rounded-3xl border bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Page Editor</h2><p className="mt-2 text-sm text-slate-500">Direct editing is intentionally kept in Live Preview. This prevents duplicate editors and ensures the pencil edits the exact content displayed on the website.</p><button onClick={()=>setTab("preview")} className="mt-5 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white"><Eye size={14} className="inline mr-1"/>Open Live Preview</button></div>}
      {tab==="inquiries"&&<div className="space-y-4"><div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[["Total",analytics.total],["Today",analytics.todayCount],["Pending",analytics.pendingCount],["Converted",analytics.convertedCount]].map(([a,b])=><div className="rounded-2xl border bg-white p-4 shadow-sm" key={a}><small className="font-bold text-slate-400">{a}</small><div className="text-2xl font-black">{b||0}</div></div>)}</div><div className="rounded-3xl border bg-white shadow-sm overflow-hidden"><div className="flex gap-2 border-b p-4"><div className="relative flex-1"><Search size={14} className="absolute left-3 top-3 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search inquiries..." className="w-full rounded-xl border bg-slate-50 py-2.5 pl-8 text-xs"/></div><select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl border px-3 text-xs"><option>All</option><option>New</option><option>Follow-up</option><option>Under Review</option><option>Approved</option><option>Converted</option><option>Rejected</option></select></div><div className="overflow-x-auto"><table className="w-full text-xs"><thead className="bg-slate-50"><tr><th className="p-3 text-left">Student</th><th className="p-3 text-left">Class</th><th className="p-3 text-left">Parent</th><th className="p-3 text-left">Status</th></tr></thead><tbody>{filtered.map(x=><tr key={x.id} className="border-t"><td className="p-3 font-bold">{x.studentName}</td><td className="p-3">{x.applyingClass}</td><td className="p-3">{x.parentName}</td><td className="p-3">{x.status||"New"}</td></tr>)}</tbody></table></div></div></div>}
      {tab==="analytics"&&<div className="grid sm:grid-cols-3 gap-4"><div className="rounded-3xl border bg-white p-6 text-center shadow"><TrendingUp className="mx-auto text-emerald-600"/><p className="mt-2 text-xs font-bold text-slate-400">CONVERSION</p><b className="text-4xl">{analytics.conversionRate||0}%</b></div><div className="rounded-3xl border bg-white p-6 shadow"><p className="text-xs font-bold text-slate-400">MOST APPLIED CLASS</p><b className="mt-2 block text-2xl">{analytics.mostAppliedClass||"N/A"}</b></div><div className="rounded-3xl border bg-white p-6 shadow"><p className="text-xs font-bold text-slate-400">TOTAL INQUIRIES</p><b className="mt-2 block text-2xl">{analytics.total||0}</b></div></div>}
    </main>
    <Modal target={target} settings={settings} onClose={()=>setTarget(null)} onSave={edit} saving={saving}/>
  </div>
}
