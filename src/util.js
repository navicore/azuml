const sortSubnets = (subnets) => {
  //todo: parameterize on cli score rules
  const score = (subnet) => {
    if (subnet.name.includes('bastion')) return 0
    if (subnet.name.includes('public')) return 1
    if (subnet.name.includes('database')) return 3
    if (subnet.name.includes('control')) return 4
    if (subnet.name.includes('cicd')) return 5
    return 2
  }
  return subnets.sort((a, b) => {
    let s1 = score(a)
    let s2 = score(b)
    return s1 - s2
  })
}

exports["sortSubnets"] = sortSubnets

