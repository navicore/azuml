const {h, mount, Component, Text} = require('ink');
const program = require('commander');

program
  .version('0.1.0')
  .option('-S, --subscription [subscription]', 'Set Subscription ID')
  .option('-c, --clientId [clientId]', 'set service principal client ID')
  .option('-s, --secret [secret]', 'set service principal secret')
  .option('-g, --group [group]', 'set resource group')
  .parse(process.argv);

program.on('--help', function(){
  console.log('');
  console.log('you must set the above params and point to a')
  console.log('resource group that contains a VNet that has')
  console.log('subnets, public IPs, load balancers, and NSGs')
  console.log('');
});

if (!program.subscription || !program.clientId || !program.secret) {
  program.help()
}

class Launcher extends Component {
	constructor() {
		super();
    this.state = {
      i: 0,
			msg: ''
		};
	}

	render() {
    return (
      <div>
        <Text green>
          {this.state.msg}
        </Text>
        <Counter/>
      </div>
		);
	}

  componentDidMount() {
		this.timer = setInterval(() => {
      this.setState({
				i: this.state.i + 1,
        msg: this.state.i + ' mounting...'
      });
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}
}

class Counter extends Component {
	constructor() {
		super();

		this.state = {
			i: 0
		};
	}

	render() {
		return (
			<Text green>
				{this.state.i} tests passed
			</Text>
		);
	}

	componentDidMount() {
		this.timer = setInterval(() => {
			this.setState({
				i: this.state.i + 1
			});
		}, 100);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}
}

mount(<Launcher></Launcher>, process.stdout);

