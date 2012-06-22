<?php require_once 'framework.php'; ?>
<?php get_header('Lesson 3 Japanese Vocabulary | Now Studying | Sleepless Demo', 'question-page'); ?>
	<section id="front" class="card one-sided-card">
		<div class="card-front fade-in">
			<span class="card-field center-field">兎</span>
		</div>
	</section>
	<section id="back">
		<form method="post" action="answer.php" class="is-muted">
			<span class="input-btn mega-btn" id="study-show-answer"><input type="submit" name="show-answer" value="Show Answer" /></span>
		</form>
		
		<div class="study-status">
			<span class="study-time">0:07</span> 
			<span class="study-progress">3/10</span> 
			<span class="study-repeats">1</span>
		</div>
	</section>
<?php get_footer('study'); ?>