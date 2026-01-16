(function(){
    console.log("Analytics Script Loaded");

    function generateUUID(){
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    }
    let visitorId = localStorage.getItem('webtrack_visitor_id');
    if(!visitorId){
        visitorId = generateUUID();
        localStorage.setItem('webtrack_visitor_id', visitorId);
    }

    const script = document.currentScript || document.querySelector('script[data-website-id]');
    if (!script) {
        console.warn("WebTrack: script tag not found");
        return;
    }
    const websiteId = script.getAttribute('data-website-id');
    const domain = script.getAttribute('data-domain');
    const entryTime = Date.now();
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
        const exitTime = Date.now();
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
            })
        })

        localStorage.removeItem('webtrack_visitor_id');
    }
    window.addEventListener('beforeunload', handleExit);
    // window.addEventListener('pagehide', handleExit);
})();
