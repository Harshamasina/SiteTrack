const { exit } = require("process");

(function(){
    console.log("Analytics Script Loaded");

    function generateUUID(){
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    }

    const session_duration = 12*60*50*1000;
    const now = Date.now();
    let sessionTime = localStorage.getItem('webtrack_session_time');

    let visitorId = localStorage.getItem('webtrack_visitor_id');
    if(!visitorId || (now - sessionTime) > session_duration){
        if(visitorId){
            localStorage.removeItem('webtrack_visitor_id');
            localStorage.removeItem('webtrack_session_time');
        }
        visitorId = generateUUID();
        localStorage.setItem('webtrack_visitor_id', visitorId);
        localStorage.setItem('webtrack_session_time', now);
    } else {
        console.log("Exising Session");
    }

    const script = document.currentScript || document.querySelector('script[data-website-id]');
    if (!script) {
        console.warn("WebTrack: script tag not found");
        return;
    }
    const websiteId = script.getAttribute('data-website-id');
    const domain = script.getAttribute('data-domain');
    const entryTime = Math.floor(Date.now() / 1000);
    const referrer = document.referrer || 'Direct';

    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || '';
    const utmMedium = urlParams.get('utm_medium') || '';
    const utmCampaign = urlParams.get('utm_campaign') || '';
    const refParams = window.location.search.replace(/^\?/, '');
    const urlParamsString = urlParams.toString();
 
    const data={
        type:'entry',
        websiteId,
        domain,
        entryTime: entryTime,
        referrer: referrer,
        url: window.location.href,
        visitorId: visitorId,
        urlParams: urlParamsString,
        utmSource,
        utmMedium,
        utmCampaign,
        refParams
    }

    const scriptSrc = script.getAttribute('src');
    const baseUrl = scriptSrc ? new URL(scriptSrc, window.location.href).origin : window.location.origin;

    fetch(`${baseUrl}/api/track`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    let activeStartTime = Date.now();
    let totalActiveTime = 0;

    const handleExit = () => {
        const exitTime = Math.floor(Date.now() / 1000);
        totalActiveTime += Date.now() - activeStartTime;

        fetch(`${baseUrl}/api/track`, {
            method: 'POST',
            keepalive: true,
            headers: {
                'content-type': "application/json",
            },
            body: JSON.stringify({
                type: 'exit',
                websiteId,
                domain,
                exitTime: exitTime,
                totalActiveTime: totalActiveTime,
                visitorId: visitorId,
                exitUrl: window.location.href,
            })
        })

        localStorage.clear();
    }
    window.addEventListener('beforeunload', handleExit);
    // window.addEventListener('pagehide', handleExit);
})();
