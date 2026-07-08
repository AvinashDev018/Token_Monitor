import "./DashboardCards.css";

function DashboardCards(){

    const cards=[

        {
            title:"Input Tokens",
            value:"1.2M"
        },

        {
            title:"Output Tokens",
            value:"340K"
        },

        {
            title:"Requests",
            value:"8241"
        },

        {
            title:"Estimated Cost",
            value:"$44.35"
        }

    ]

    return(

        <div className="cards">

            {

                cards.map((card,index)=>(

                    <div className="card" key={index}>

                        <h3>{card.title}</h3>

                        <h2>{card.value}</h2>

                    </div>

                ))

            }

        </div>

    )

}

export default DashboardCards;