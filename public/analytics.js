(function(){
    console.log("Analytics Script Loaded");

    function generateUUID(){
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    }

    const session_duration = 12 * 60 * 50 * 1000;
    const now = Date.now();
    const sessionTimeRaw = localStorage.getItem('webtrack_session_time');
    const sessionTime = Number(sessionTimeRaw) || 0;

    let visitorId = localStorage.getItem('webtrack_visitor_id');
    if(!visitorId || (now - sessionTime) > session_duration){
        if(visitorId){
            localStorage.removeItem('webtrack_visitor_id');
            localStorage.removeItem('webtrack_session_time');
        }
        visitorId = generateUUID();
        localStorage.setItem('webtrack_visitor_id', visitorId);
        localStorage.setItem('webtrack_session_time', now.toString());
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
    let lastActivityTime = Date.now();
    const IDLE_TIMEOUT = 30000; // 30 seconds

    function startActive(){
        if(activeStartTime === null){
            activeStartTime = Date.now();
        }
    }

    function stopActive(){
        if(activeStartTime !== null){
            totalActiveTime += Date.now() - activeStartTime;
            activeStartTime = null;
        }
    }

    ["mousemove", "keydown", "scroll", "click", "touchstart"].forEach((evt) => {
        window.addEventListener(evt, () => {
            lastActivityTime = Date.now();
            startActive();
        }, {passive: true});
    })

    setInterval(() => {
        if(Date.now() - lastActivityTime > IDLE_TIMEOUT){
            stopActive();
        } else {
            startActive();
        }
    }, 5000);

    document.addEventListener("visibilitychange", () => {
        if(document.visibilityState === "hidden"){
            stopActive();
        } else {
            lastActivityTime = Date.now();
            startActive();
        }
    });



    const handleExit = () => {
        stopActive();

        const exitTime = Math.floor(Date.now() / 1000);
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

        localStorage.removeItem('webtrack_session_time');
        localStorage.removeItem('webtrack_visitor_id');
    }
    window.addEventListener('beforeunload', handleExit);
    window.addEventListener('pagehide', handleExit);

    const sendLivePing = () => {
        fetch(`${baseUrl}/api/live`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                visitorId,
                websiteId,
                last_seen: Date.now().toString(),
                url: window.location.href,
            })
        })
    };
    setInterval(sendLivePing, 30000);
})();
