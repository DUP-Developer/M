var app = new Vue({
    el: '#app',
    data: {
        talk: '',
        messages: [],
        context: false,        
        myId: false,
        isReply: false
    },
    methods: {
        "sendTalk": function (talk) {

            this.messages.push({
                text: talk,
                owner: "You"
            });

            if (!this.context.isReply) {
                $.get('/api/m', {
                    message: talk
                }, function(a) {
                    console.log(a)
                })
            } else {
                app.$data.context.message = talk

                $.get('/api/m', {
                    message: talk
                }, function(a) {
                    console.log(a)
                })

                //this.context.isReply = !this.context.isReply
            }

            this.talk = '';
        }
    }
})

